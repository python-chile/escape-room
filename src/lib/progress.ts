import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "pyschool-progress:v1";

type StoredProgress = {
  completedRooms: string[];
};

function normalizePath(path: string) {
  return path.replace(/\/+$/, "") || "/";
}

function readProgress(): StoredProgress {
  try {
    const rawProgress = window.localStorage.getItem(STORAGE_KEY);

    if (!rawProgress) {
      return { completedRooms: [] };
    }

    const progress = JSON.parse(rawProgress) as Partial<StoredProgress>;

    if (!Array.isArray(progress.completedRooms)) {
      return { completedRooms: [] };
    }

    return {
      completedRooms: progress.completedRooms
        .filter((room) => typeof room === "string")
        .map(normalizePath),
    };
  } catch {
    return { completedRooms: [] };
  }
}

function writeProgress(progress: StoredProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

  window.dispatchEvent(
    new CustomEvent("pyschool-progress-change", {
      detail: progress,
    }),
  );
}

async function getCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user ?? null;
}

async function saveRoomToCloud(roomId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  const { error } = await supabase.from("room_progress").upsert(
    {
      user_id: user.id,
      room_id: roomId,
    },
    {
      onConflict: "user_id,room_id",
      ignoreDuplicates: true,
    },
  );

  if (error) {
    console.error("No fue posible sincronizar el progreso:", error.message);
  }
}

export function getCompletedRooms() {
  return new Set(readProgress().completedRooms);
}

export function completeRoom(roomPath = window.location.pathname) {
  const completedRooms = getCompletedRooms();
  const normalizedPath = normalizePath(roomPath);

  if (completedRooms.has(normalizedPath)) {
    return;
  }

  completedRooms.add(normalizedPath);

  writeProgress({
    completedRooms: [...completedRooms],
  });

  void saveRoomToCloud(normalizedPath);
}

export async function syncProgressWithCloud() {
  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  const { data, error } = await supabase
    .from("room_progress")
    .select("room_id")
    .eq("user_id", user.id);

  if (error) {
    console.error("No fue posible cargar el progreso:", error.message);
    return;
  }

  const localRooms = getCompletedRooms();
  const remoteRooms = new Set(data.map((room) => normalizePath(room.room_id)));
  const mergedRooms = new Set([...localRooms, ...remoteRooms]);

  const pendingRooms = [...localRooms].filter(
    (roomId) => !remoteRooms.has(roomId),
  );

  if (pendingRooms.length > 0) {
    const { error: syncError } = await supabase.from("room_progress").upsert(
      pendingRooms.map((roomId) => ({
        user_id: user.id,
        room_id: roomId,
      })),
      {
        onConflict: "user_id,room_id",
        ignoreDuplicates: true,
      },
    );

    if (syncError) {
      console.error(
        "No fue posible enviar el progreso local:",
        syncError.message,
      );
    }
  }

  if (mergedRooms.size !== localRooms.size) {
    writeProgress({
      completedRooms: [...mergedRooms],
    });
  }
}

export function resetProgress() {
  writeProgress({
    completedRooms: [],
  });
}
