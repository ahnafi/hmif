import Layout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Eye, Filter, Newspaper, Search, User } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface Author {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    thumbnail?: string;
    content: string;
    created_at: string;
    author?: Author;
    category?: Category;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedArticles {
    data: Article[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface ArticlesProps {
    articles: PaginatedArticles;
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
    };
}

export default function ArticlesIndex({ articles, categories, filters }: ArticlesProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
    const isInitialRender = useRef(true);

    // Debounced search to avoid too many requests
    const debouncedSearch = useDebouncedCallback((value: string, category: string) => {
        router.get(
            '/berita',
            {
                search: value || undefined,
                category: category === 'all' ? undefined : category,
            },
            {
                preserveState: false,
                replace: true,
            },
        );
    }, 500);

    // Handle search input change - only trigger on user input, not on prop updates
    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        debouncedSearch(searchTerm, selectedCategory);
    }, [searchTerm, selectedCategory, debouncedSearch]);

    // Handle category filter change
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        router.get(
            '/berita',
            {
                search: searchTerm || undefined,
                category: category === 'all' ? undefined : category,
            },
            {
                preserveState: false,
                replace: true,
            },
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const truncateContent = (content: string, maxLength: number = 150) => {
        const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
        if (textContent.length <= maxLength) return textContent;
        return textContent.substring(0, maxLength) + '...';
    };

    const stats = [
        {
            icon: <Newspaper className="h-6 w-6" />,
            label: 'Total Artikel',
            value: articles.total.toString(),
        },
        {
            icon: <Filter className="h-6 w-6" />,
            label: 'Kategori',
            value: categories.length.toString(),
        },
        {
            icon: <Eye className="h-6 w-6" />,
            label: 'Halaman',
            value: articles.current_page.toString(),
        },
    ];

    // Pagination component
    const Pagination = () => {
        if (articles.last_page <= 1) return null;

        return (
            <div className="flex items-center justify-between rounded-lg border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-1 justify-between sm:hidden">
                    {articles.links[0]?.url && (
                        <Link
                            href={articles.links[0].url || ''}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Sebelumnya
                        </Link>
                    )}
                    {articles.links[articles.links.length - 1]?.url && (
                        <Link
                            href={articles.links[articles.links.length - 1].url || ''}
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Selanjutnya
                        </Link>
                    )}
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Showing <span className="font-medium">{articles.from}</span> to <span className="font-medium">{articles.to}</span> of{' '}
                            <span className="font-medium">{articles.total}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            {articles.links.map((link, index) => {
                                // Skip first and last (Previous/Next buttons)
                                if (index === 0 || index === articles.links.length - 1) {
                                    if (!link.url) return null;

                                    return (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`relative inline-flex items-center px-2 py-2 text-sm font-medium ${
                                                index === 0 ? 'rounded-l-md' : 'rounded-r-md'
                                            } border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
                                        >
                                            <span className="sr-only">{link.label}</span>
                                            {index === 0 ? (
                                                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                            ) : (
                                                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                            )}
                                        </Link>
                                    );
                                }

                                // Page numbers
                                if (!link.url && link.label === '...') {
                                    return (
                                        <span
                                            key={index}
                                            className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                        >
                                            ...
                                        </span>
                                    );
                                }

                                return (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                                            link.active
                                                ? 'z-10 border-blue-imphnen-base bg-blue-imphnen-base text-white'
                                                : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                                        }`}
                                        aria-current={link.active ? 'page' : undefined}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <Head title="Berita & Artikel" />

            {/* Hero Section */}
            <section className="section-padding-x relative scroll-mt-12 bg-light-base pt-32 pb-16 text-dark-base dark:bg-dark-base dark:text-light-base">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 -z-10 h-96 w-96 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
                    <div className="absolute right-0 bottom-0 -z-10 h-96 w-96 rounded-full bg-purple-400 opacity-20 blur-3xl"></div>
                </div>
                <div className="relative mx-auto max-w-screen-xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
                        <div className="mb-6 flex justify-center">
                            <span className="flex items-center gap-2 rounded-full bg-gradient-to-br from-blue-imphnen-base to-blue-imphnen-secondary px-4 py-2 text-white">
                                <Newspaper className="h-5 w-5" />
                                <span className="text-sm font-medium">Berita & Artikel</span>
                            </span>
                        </div>
                        <h1 className="mb-4 font-bold">Berita & Artikel</h1>
                        <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
                            Ikuti perkembangan terbaru seputar kegiatan HMIF Unsoed, berita teknologi, dan artikel informatif lainnya yang bermanfaat
                            untuk pengembangan diri mahasiswa Informatika.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-12 grid gap-6 md:grid-cols-3"
                    >
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50"
                            >
                                <div className="mb-3 flex justify-center">
                                    <div className="rounded-full bg-blue-imphnen-base/20 p-3">{stat.icon}</div>
                                </div>
                                <div className="mb-1 text-2xl font-bold">{stat.value}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="section-padding-x bg-light-base py-8 text-dark-base dark:bg-dark-base dark:text-light-base">
                <div className="mx-auto max-w-screen-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                    >
                        {/* Search */}
                        <div className="relative max-w-md flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari artikel atau berita..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-dark-base focus:border-blue-imphnen-base focus:ring-1 focus:ring-blue-imphnen-base focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-light-base dark:focus:border-blue-imphnen-secondary"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="min-w-[180px] justify-between">
                                        {selectedCategory === 'all'
                                            ? 'Semua Kategori'
                                            : categories.find((cat) => cat.id.toString() === selectedCategory)?.name || 'Kategori'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuCheckboxItem
                                        checked={selectedCategory === 'all'}
                                        onCheckedChange={() => handleCategoryChange('all')}
                                    >
                                        Semua Kategori
                                    </DropdownMenuCheckboxItem>
                                    {categories.map((category) => (
                                        <DropdownMenuCheckboxItem
                                            key={category.id}
                                            checked={selectedCategory === category.id.toString()}
                                            onCheckedChange={() => handleCategoryChange(category.id.toString())}
                                        >
                                            {category.name}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Articles Section */}
            <section className="section-padding-x bg-light-base py-16 text-dark-base dark:bg-dark-base dark:text-light-base">
                <div className="mx-auto max-w-screen-xl">
                    {articles.data.length > 0 ? (
                        <>
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="mb-8"
                            >
                                <h2 className="mb-2 font-bold text-dark-base dark:text-light-base">Daftar Artikel & Berita</h2>
                                <div className="h-1 w-20 rounded bg-gradient-to-r from-blue-imphnen-base to-blue-imphnen-secondary"></div>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Menampilkan {articles.from}-{articles.to} dari {articles.total} artikel
                                </p>
                            </motion.div>

                            {/* Articles Grid */}
                            <div className="mb-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {articles.data.map((article, index) => (
                                    <motion.article
                                        key={article.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative h-48 overflow-hidden">
                                            {article.thumbnail ? (
                                                <img
                                                    src={`/storage/${article.thumbnail}`}
                                                    alt={article.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-imphnen-base to-blue-imphnen-secondary">
                                                    <Newspaper className="h-12 w-12 text-white/80" />
                                                </div>
                                            )}
                                            {article.category && (
                                                <div className="absolute top-3 left-3">
                                                    <span className="rounded-full bg-blue-imphnen-base px-3 py-1 text-xs font-medium text-white">
                                                        {article.category.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            {/* Meta Info */}
                                            <div className="mb-3 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{formatDate(article.created_at)}</span>
                                                </div>
                                                {article.author && (
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-4 w-4" />
                                                        <span>{article.author.name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className="mb-3 line-clamp-2 leading-tight font-semibold text-gray-900 dark:text-white">
                                                {article.title}
                                            </h3>

                                            {/* Content Preview */}
                                            <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-300">{truncateContent(article.content)}</p>

                                            {/* Read More Button */}
                                            <Link
                                                href={`/berita/${article.slug}`}
                                                className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-imphnen-base to-blue-imphnen-secondary px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-md"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span>Baca Selengkapnya</span>
                                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                            </Link>
                                        </div>
                                    </motion.article>
                                ))}
                            </div>

                            {/* Pagination */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <Pagination />
                            </motion.div>
                        </>
                    ) : (
                        /* Empty State */
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="py-16 text-center"
                        >
                            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                <Newspaper className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Tidak Ada Artikel Ditemukan</h3>
                            <p className="text-gray-600 dark:text-gray-400">Coba ubah kata kunci pencarian atau filter kategori yang digunakan.</p>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Categories Overview */}
            {categories.length > 0 && (
                <section className="section-padding-x bg-gray-50 py-16 text-dark-base dark:bg-gray-900 dark:text-light-base">
                    <div className="mx-auto max-w-screen-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="mb-12 text-center"
                        >
                            <h2 className="mb-4 font-bold text-dark-base dark:text-light-base">Kategori Artikel</h2>
                            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">Jelajahi artikel berdasarkan kategori yang tersedia</p>
                        </motion.div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    onClick={() => handleCategoryChange(category.id.toString())}
                                    className={`rounded-lg p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md ${
                                        selectedCategory === category.id.toString()
                                            ? 'bg-blue-imphnen-base text-white'
                                            : 'bg-white text-dark-base hover:bg-blue-50 dark:bg-gray-800 dark:text-light-base dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <div className="mb-4 flex justify-center">
                                        <div
                                            className={`rounded-full p-3 ${
                                                selectedCategory === category.id.toString() ? 'bg-white/20' : 'bg-blue-imphnen-base/20'
                                            }`}
                                        >
                                            <Filter
                                                className={`h-6 w-6 ${
                                                    selectedCategory === category.id.toString() ? 'text-white' : 'text-blue-imphnen-base'
                                                }`}
                                            />
                                        </div>
                                    </div>
                                    <h3 className="font-semibold">{category.name}</h3>
                                    <p
                                        className={`mt-2 text-sm ${
                                            selectedCategory === category.id.toString() ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
                                        }`}
                                    >
                                        Kategori Aktif
                                    </p>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </Layout>
    );
}
