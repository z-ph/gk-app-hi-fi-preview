import { Picker } from 'antd-mobile'
import { DownOutline } from 'antd-mobile-icons'
import type {
  AreaOption,
  CourseFilterState,
  ProjectOption,
} from '@/types/info'

interface CourseFilterBarProps {
  readonly projects: ReadonlyArray<ProjectOption>
  readonly areas: ReadonlyArray<AreaOption>
  readonly value: CourseFilterState
  readonly onChange: (value: CourseFilterState) => void
}

export function CourseFilterBar({
  projects,
  areas,
  value,
  onChange,
}: CourseFilterBarProps) {
  const selectedProject = projects.find((item) => item.id === value.projectId)
  const availableAreas = areas.filter((area) => area.projectIds.includes(value.projectId))
  const selectedArea =
    availableAreas.find((item) => item.id === value.areaId) ?? availableAreas[0]

  const projectColumns = [
    projects.map((project) => ({
      label: project.name,
      value: project.id,
    })),
  ]
  const areaColumns = [
    availableAreas.map((area) => ({
      label: area.name,
      value: area.id,
    })),
  ]

  return (
    <div className="grid grid-cols-2 gap-2 rounded-[8px] bg-white p-2 shadow-sm">
      <Picker
        columns={projectColumns}
        value={[value.projectId]}
        onConfirm={([projectId]) => {
          const nextProjectId = String(projectId)
          const nextArea =
            areas.find(
              (area) => area.id === value.areaId && area.projectIds.includes(nextProjectId),
            ) ?? areas.find((area) => area.projectIds.includes(nextProjectId))

          onChange({
            ...value,
            projectId: nextProjectId,
            areaId: nextArea?.id ?? value.areaId,
          })
        }}
      >
        {(items, { open }) => (
          <button
            className="flex h-10 min-w-0 items-center justify-between rounded-[8px] bg-[#f7f8fa] px-3 text-left"
            onClick={open}
          >
            <span className="min-w-0 truncate text-[14px] font-medium">
              {items[0]?.label ?? selectedProject?.name ?? '选择项目'}
            </span>
            <DownOutline className="shrink-0 text-[#969696]" />
          </button>
        )}
      </Picker>

      <Picker
        columns={areaColumns}
        value={[selectedArea?.id ?? value.areaId]}
        onConfirm={([areaId]) =>
          onChange({
            ...value,
            areaId: String(areaId),
          })
        }
      >
        {(items, { open }) => (
          <button
            className="flex h-10 min-w-0 items-center justify-between rounded-[8px] bg-[#f7f8fa] px-3 text-left"
            onClick={open}
          >
            <span className="min-w-0 truncate text-[14px] font-medium">
              {items[0]?.label ?? selectedArea?.name ?? '选择地区'}
            </span>
            <DownOutline className="shrink-0 text-[#969696]" />
          </button>
        )}
      </Picker>
    </div>
  )
}
