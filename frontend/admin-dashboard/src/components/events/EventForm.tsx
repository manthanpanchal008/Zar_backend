"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { API_BASE_URL, api, uploadConfig } from "@/lib/api";
import type { Event } from "@/types";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

type EventFormValues = {
  title: string;
  status: "upcoming" | "past";
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  event_url: string;
  images: FileList;
};

export function EventForm({ event }: { event?: Event }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>(event?.event_image || []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    defaultValues: {
      title: event?.title || "",
      status: event?.status || "upcoming",
      location: event?.location || "",
      start_date: event?.start_date ? event.start_date.split("T")[0] : "",
      end_date: event?.end_date ? event.end_date.split("T")[0] : "",
      description: event?.description || "",
      event_url: event?.event_url || "",
    },
  });

  const handleRemoveExistingImage = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  async function onSubmit(values: EventFormValues) {
    setError("");
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "images") {
        formData.append(key, (value as string) || "");
      }
    });

    formData.append("existing_images", JSON.stringify(existingImages));
    Array.from(values.images || []).forEach((file) => formData.append("images", file));

    try {
      if (event) {
        await api.put(`/api/admin/events/${event.id}`, formData, uploadConfig());
      } else {
        await api.post("/api/admin/events", formData, uploadConfig());
      }
      router.push("/events");
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || "Unable to save event.");
    }
  }

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      {error ? <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">{error}</div> : null}

      <label className="md:col-span-2">
        <span className="mb-1 block text-sm font-semibold text-zar-title">Event Title *</span>
        <input className="form-input" {...register("title", { required: "Event title is required" })} />
        {errors.title ? <span className="text-xs text-red-600">{errors.title.message}</span> : null}
      </label>

      <label>
        <span className="mb-1 block text-sm font-semibold text-zar-title">Status *</span>
        <select className="form-input" {...register("status", { required: "Status is required" })}>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
        {errors.status ? <span className="text-xs text-red-600">{errors.status.message}</span> : null}
      </label>

      <label>
        <span className="mb-1 block text-sm font-semibold text-zar-title">Location</span>
        <input className="form-input" {...register("location")} />
      </label>

      <label>
        <span className="mb-1 block text-sm font-semibold text-zar-title">Start Date</span>
        <input className="form-input" type="date" {...register("start_date")} />
      </label>

      <label>
        <span className="mb-1 block text-sm font-semibold text-zar-title">End Date</span>
        <input className="form-input" type="date" {...register("end_date")} />
      </label>

      <div className="md:col-span-2">
        <span className="mb-1 block text-sm font-semibold text-zar-title">Description</span>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Short description of the event..."
            />
          )}
        />
      </div>

      <label>
        <span className="mb-1 block text-sm font-semibold text-zar-title">Event Link Slug / URL</span>
        <input className="form-input" placeholder="exhibition-june-2026" {...register("event_url")} />
        <span className="text-xs text-zar-muted">Slug or url path</span>
      </label>

      <div className="md:col-span-2">
        <span className="mb-1 block text-sm font-semibold text-zar-title">Upload Images</span>
        <Controller
          control={control}
          name="images"
          render={({ field }) => (
            <ImageUpload
              onChange={field.onChange}
              multiple
              error={errors.images?.message}
            />
          )}
        />
        <span className="text-xs text-zar-muted mt-1 block">You can upload up to 10 images.</span>
      </div>

      {existingImages.length > 0 && (
        <div className="md:col-span-2 space-y-2">
          <span className="block text-sm font-semibold text-zar-title">Existing Images</span>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((imgName, idx) => {
              const url = `${API_BASE_URL}/uploads/events/${imgName}`;
              return (
                <div key={imgName} className="relative group rounded-lg overflow-hidden border border-[#eee7dd] h-20 w-20">
                  <img src={url} alt="event" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2 md:col-span-2 mt-2">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : "Save Event"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/events")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
