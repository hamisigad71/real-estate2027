"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types";
import {
  MapPin,
  Calendar,
  Building2,
  Trash2,
  ArrowRight,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onDelete: (projectId: string) => void;
}

const projectTypeLabels: Record<Project["projectType"], string> = {
  apartment: "Apartment",
  "single-family": "Single Family",
  mixed: "Mixed Use",
};

const projectTypeBadgeColors: Record<Project["projectType"], string> = {
  apartment: "bg-blue-50 text-blue-800 border-blue-200",
  "single-family": "bg-emerald-50 text-emerald-800 border-emerald-200",
  mixed: "bg-purple-50 text-purple-800 border-purple-200",
};

const incomeGroupLabels: Record<Project["targetIncomeGroup"], string> = {
  low: "Low Income",
  "lower-middle": "Lower-Middle",
  middle: "Middle Income",
  mixed: "Mixed Income",
};

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleOpen = () => {
    router.push(`/project/${project.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete(project.id);
    } else {
      setConfirmDelete(true);
      // Auto-cancel after 3 seconds
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const formattedBudget = () => {
    const max = project.budgetRange.max;
    const currency = project.budgetRange.currency || "USD";
    if (max >= 1_000_000) return `${currency} ${(max / 1_000_000).toFixed(1)}M`;
    if (max >= 1_000) return `${currency} ${(max / 1_000).toFixed(0)}K`;
    return `${currency} ${max.toLocaleString()}`;
  };

  return (
    <Card
      className="group border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white overflow-hidden cursor-pointer"
      onClick={handleOpen}
    >
      {/* Top accent bar based on project type */}
      <div
        className={`h-1 w-full ${
          project.projectType === "apartment"
            ? "bg-blue-900"
            : project.projectType === "single-family"
            ? "bg-emerald-500"
            : "bg-purple-500"
        }`}
      />

      <CardContent className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 text-sm leading-snug truncate group-hover:text-blue-900 transition-colors">
              {project.name}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3 text-blue-700 shrink-0" />
              <span className="truncate">
                {project.location.city}, {project.location.country}
              </span>
            </div>
          </div>

          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0.5 shrink-0 border ${
              projectTypeBadgeColors[project.projectType]
            }`}
          >
            {projectTypeLabels[project.projectType]}
          </Badge>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-slate-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-1 mb-0.5">
              <DollarSign className="h-3 w-3 text-amber-600" />
              <span className="text-[10px] text-slate-500 font-medium">Budget</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">{formattedBudget()}</p>
          </div>

          <div className="bg-slate-50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-1 mb-0.5">
              <Building2 className="h-3 w-3 text-blue-700" />
              <span className="text-[10px] text-slate-500 font-medium">Land</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">
              {project.landSize.toLocaleString()} {project.landSizeUnit}
            </p>
          </div>
        </div>

        {/* Income group */}
        <div className="mb-4">
          <span className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">
            Target Group
          </span>
          <p className="text-xs font-medium text-slate-700 mt-0.5">
            {incomeGroupLabels[project.targetIncomeGroup]}
          </p>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Calendar className="h-3 w-3" />
            {new Date(project.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          <div className="flex items-center gap-1">
            {/* Delete button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteClick}
              className={`h-7 px-2 text-[10px] transition-colors ${
                confirmDelete
                  ? "text-red-600 bg-red-50 hover:bg-red-100"
                  : "text-slate-400 hover:text-red-500 hover:bg-red-50"
              }`}
            >
              {confirmDelete ? (
                <>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Confirm
                </>
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
            </Button>

            {/* Open button */}
            <Button
              size="sm"
              onClick={handleOpen}
              className="h-7 px-3 text-[10px] bg-blue-900 hover:bg-blue-800 text-white"
            >
              Open
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
