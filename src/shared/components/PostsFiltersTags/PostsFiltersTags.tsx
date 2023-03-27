import {
  IPostFilters,
  PostFiltersTagNamesType,
} from '@interfaces/posts.interface'
import { Tag } from 'antd'

export interface IPostsFiltersTagsProps {
  tags: PostFiltersTagNamesType
  onCloseTag?: (key: keyof IPostFilters, dynamicId?: string) => void
}

export const PostsFiltersTags = ({
  tags,
  onCloseTag,
}: IPostsFiltersTagsProps) => {
  return (Object.keys(tags) as any).map((f: keyof IPostFilters) => {
    if (f === 'filterParams' && tags.filterParams) {
      return tags.filterParams.map((param) => (
        <Tag
          color="green"
          closable
          onClose={() => onCloseTag && onCloseTag(f, param.value)}
        >
          <span>{param.label}</span>
        </Tag>
      ))
    }
    return (
      <Tag color="green" closable onClose={() => onCloseTag && onCloseTag(f)}>
        <span>{tags[f] as string}</span>
      </Tag>
    )
  })
}
