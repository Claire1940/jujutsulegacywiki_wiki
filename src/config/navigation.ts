import {
	Ticket,
	BookOpen,
	Swords,
	Shield,
	Users,
	Hammer,
	type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 导航配置：Jujutsu Legacy 六大内容分类（community 分类已剔除，不进导航栏）
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'codes', path: '/codes', icon: Ticket, isContentType: true },
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'techniques', path: '/techniques', icon: Swords, isContentType: true },
	{ key: 'vessels', path: '/vessels', icon: Shield, isContentType: true },
	{ key: 'clans', path: '/clans', icon: Users, isContentType: true },
	{ key: 'builds', path: '/builds', icon: Hammer, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
)

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
