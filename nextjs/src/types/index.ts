// Prisma 모델 기반 타입 정의

export interface Admin {
  id: string
  email: string
  password: string
  name: string
  role: AdminRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}

export interface SiteSetting {
  id: string
  key: string
  value?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface Board {
  id: string
  title: string
  key: string
  description?: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
  categories?: Category[]
  posts?: Post[]
}

export interface Category {
  id: string
  name: string
  key: string
  boardId: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
  board?: Board
  posts?: Post[]
}

export interface Post {
  id: string
  title: string
  content?: string
  excerpt?: string
  status: PostStatus
  isPublished: boolean
  isFeatured: boolean
  viewCount: number
  likeCount: number
  boardId: string
  categoryId?: string
  authorName?: string
  authorEmail?: string
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  board?: Board
  category?: Category
  media?: PostMedia[]
  tags?: Tag[]
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface PostMedia {
  id: string
  postId: string
  fileName: string
  filePath: string
  fileSize?: number
  mimeType?: string
  altText?: string
  sortOrder: number
  createdAt: Date
  post?: Post
}

export interface Tag {
  id: string
  name: string
  slug: string
  createdAt: Date
  posts?: Post[]
}

export interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
  subject?: string
  message: string
  type: ContactType
  status: ContactStatus
  adminReply?: string
  repliedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export enum ContactType {
  INQUIRY = 'INQUIRY',
  COMPLAINT = 'COMPLAINT',
  SUGGESTION = 'SUGGESTION',
  CONSULTATION = 'CONSULTATION',
}

export enum ContactStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
  isActive: boolean
  sortOrder: number
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Banner {
  id: string
  title: string
  description?: string
  imageUrl?: string
  linkUrl?: string
  position: BannerPosition
  isActive: boolean
  startDate?: Date
  endDate?: Date
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export enum BannerPosition {
  MAIN = 'MAIN',
  SUB = 'SUB',
  SIDEBAR = 'SIDEBAR',
  FOOTER = 'FOOTER',
}

export interface RealTimeInquiry {
  id: string
  name: string
  phone?: string
  email?: string
  title: string
  content: string
  status: RealTimeInquiryStatus
  isUrgent: boolean
  adminReply?: string
  repliedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export enum RealTimeInquiryStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Review {
  id: string
  name: string
  title: string
  content: string
  rating: number
  status: ReviewStatus
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Statistic {
  id: string
  key: string
  value: string
  label?: string
  createdAt: Date
  updatedAt: Date
}

// API Response 타입
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T = any> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  message?: string
}

// 컴포넌트 Props 타입
export interface ComponentProps {
  children?: React.ReactNode
  className?: string
}

// 폼 데이터 타입
export interface ContactFormData {
  name: string
  email?: string
  phone?: string
  subject?: string
  message: string
  type?: ContactType
}

export interface InquiryFormData {
  name: string
  phone?: string
  email?: string
  title: string
  content: string
  isUrgent?: boolean
}

export interface ReviewFormData {
  name: string
  title: string
  content: string
  rating: number
}

// 검색/필터 타입
export interface SearchParams {
  q?: string
  page?: number
  limit?: number
  category?: string
  status?: string
  sort?: string
  order?: 'asc' | 'desc'
}

// 메뉴 아이템 타입
export interface MenuItem {
  id: string
  title: string
  href: string
  children?: MenuItem[]
  isActive?: boolean
}

// 네비게이션 타입
export interface NavigationProps {
  items: MenuItem[]
  currentPath?: string
}

// 탭 타입
export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  isActive?: boolean
}

// 슬라이더 타입
export interface SlideItem {
  id: string
  title?: string
  description?: string
  imageUrl?: string
  linkUrl?: string
}

// 테이블 컬럼 타입
export interface TableColumn {
  key: string
  title: string
  sortable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
}

// 페이지네이션 타입
export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showSizeChanger?: boolean
  pageSizeOptions?: number[]
  pageSize?: number
  onPageSizeChange?: (size: number) => void
} 