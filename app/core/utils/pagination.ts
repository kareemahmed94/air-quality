import { PaginationType } from '@/core/types/common'

export const pagination = (page: number = 1, perPage: number = 20): PaginationType => {
  const skip = (perPage || 10) * ((page || 1) - 1)
  const take = perPage || 10
  return { skip, take }
}

export const getPaginationInfo = (count: number, page: number, perPage: number) => {
  return {
    totalRecords: Number(count),
    totalPages: Math.round(count / perPage),
    itemsPerPage: Number(perPage),
    currentPage: Number(page),
  }
}
