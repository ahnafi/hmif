import Layout from '@/components/layout';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Award, Calendar, ChevronLeft, ChevronRight, Eye, Medal, Plus, Search, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface Student {
    id: number;
    nim: string;
    name: string;
    student_id: string;
}

interface AchievementType {
    id: number;
    name: string;
}

interface AchievementCategory {
    id: number;
    name: string;
}

interface AchievementLevel {
    id: number;
    name: string;
}

interface Achievement {
    id: number;
    name: string;
    description?: string;
    images?: string[];
    proof?: string;
    awarded_at: string;
    approval: boolean;
    achievement_type_id: number;
    achievement_category_id: number;
    achievement_level_id: number;
    achievement_type: AchievementType;
    achievement_category: AchievementCategory;
    achievement_level: AchievementLevel;
    students: Student[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedAchievements {
    data: Achievement[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface TopStudent {
    id: number;
    nim: string;
    name: string;
    achievement_count: number;
}

interface IFBanggaProps {
    achievements: PaginatedAchievements;
    types: AchievementType[];
    categories: AchievementCategory[];
    levels: AchievementLevel[];
    years: number[];
    topStudents: TopStudent[];
    filters: {
        search?: string;
        type?: string;
        category?: string;
        level?: string;
        year?: string;
    };
}

export default function IFBanggaPage({ achievements, types, categories, levels, years, topStudents, filters }: IFBanggaProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.type || 'all');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
    const [selectedLevel, setSelectedLevel] = useState(filters.level || 'all');
    const [selectedYear, setSelectedYear] = useState(filters.year || 'all');

    console.log("Students Achievements:", achievements);

    // Debounced search
    const debouncedSearch = useDebouncedCallback(() => {
        handleFilter();
    }, 500);

    useEffect(() => {
        debouncedSearch();
    }, [searchTerm]);

    const handleFilter = () => {
        router.get(
            '/if-bangga',
            {
                search: searchTerm || undefined,
                type: selectedType === 'all' ? undefined : selectedType,
                category: selectedCategory === 'all' ? undefined : selectedCategory,
                level: selectedLevel === 'all' ? undefined : selectedLevel,
                year: selectedYear === 'all' ? undefined : selectedYear,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const stats = [
        {
            icon: <Trophy className="h-6 w-6" />,
            label: 'Total Prestasi',
            value: achievements.total.toString(),
        },
        {
            icon: <Award className="h-6 w-6" />,
            label: 'Kategori',
            value: categories.length.toString(),
        },
        {
            icon: <Medal className="h-6 w-6" />,
            label: 'Tingkat',
            value: levels.length.toString(),
        },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getLevelColor = (levelName: string) => {
        const name = levelName.toLowerCase();
        if (name.includes('internasional')) return 'bg-purple-500';
        if (name.includes('nasional')) return 'bg-red-500';
        if (name.includes('regional') || name.includes('provinsi')) return 'bg-blue-500';
        if (name.includes('lokal') || name.includes('universitas')) return 'bg-green-500';
        return 'bg-gray-500';
    };

    // Pagination component
    const Pagination = () => {
        if (achievements.last_page <= 1) return null;

        return (
            <div className="flex items-center justify-between rounded-lg border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-1 justify-between sm:hidden">
                    {achievements.links[0]?.url && (
                        <Link
                            href={achievements.links[0].url}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Previous
                        </Link>
                    )}
                    {achievements.links[achievements.links.length - 1]?.url && (
                        <Link
                            href={achievements.links[achievements.links.length - 1].url}
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Next
                        </Link>
                    )}
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Showing <span className="font-medium">{achievements.from}</span> to <span className="font-medium">{achievements.to}</span>{' '}
                            of <span className="font-medium">{achievements.total}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            {achievements.links.map((link, index) => {
                                if (index === 0 || index === achievements.links.length - 1) {
                                    if (!link.url) return null;

                                    return (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`relative inline-flex items-center px-2 py-2 text-sm font-medium ${
                                                index === 0 ? 'rounded-l-md' : 'rounded-r-md'
                                            } border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700`}
                                        >
                                            {index === 0 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                                        </Link>
                                    );
                                }

                                if (!link.url && link.label === '...') {
                                    return (
                                        <span
                                            key={index}
                                            className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
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
            <Head title="IF Bangga - Prestasi Mahasiswa" />

            {/* Hero Section */}
            <section className="section-padding-x relative scroll-mt-12 bg-light-base pt-32 pb-16 text-dark-base dark:bg-dark-base dark:text-light-base">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 -z-10 h-96 w-96 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
                    <div className="absolute right-0 bottom-0 -z-10 h-96 w-96 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
                </div>
                <div className="relative mx-auto max-w-screen-xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
                        <div className="mb-6 flex justify-center">
                            <span className="flex items-center gap-2 rounded-full bg-gradient-to-br from-blue-imphnen-base to-blue-imphnen-secondary px-4 py-2 text-white">
                                <Trophy className="h-5 w-5" />
                                <span className="text-sm font-medium">IF Bangga</span>
                            </span>
                        </div>
                        <h1 className="mb-4 font-bold">IF Bangga</h1>
                        <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
                            Kumpulan prestasi membanggakan yang diraih oleh mahasiswa Informatika Unsoed di berbagai kompetisi dan kegiatan akademik
                            maupun non-akademik.
                        </p>
                    </motion.div>

                    {/* Top 3 Students Ranking */}
                    {topStudents && topStudents.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.15 }}
                            className="mt-8 px-4 sm:mt-12"
                        >
                            <h2 className="mb-4 text-center text-xl font-bold sm:mb-6 sm:text-2xl">🏆 Top 3 Mahasiswa Berprestasi</h2>
                            <div className="flex items-end justify-center gap-2 sm:gap-4">
                                {/* Rank 2 - Left (Medium Height) */}
                                {topStudents[1] && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                        className="relative flex w-full max-w-[120px] flex-col items-center sm:max-w-[200px]"
                                    >
                                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-400 text-lg font-bold text-white shadow-lg sm:mb-4 sm:h-16 sm:w-16 sm:text-2xl">
                                            2
                                        </div>
                                        <div className="w-full rounded-t-lg bg-gradient-to-br from-gray-200 to-gray-300 p-3 pt-6 pb-6 text-center shadow-lg dark:from-gray-700 dark:to-gray-800 sm:p-6 sm:pt-14 sm:pb-14">
                                            <div className="mb-1 line-clamp-2 text-sm font-bold text-gray-800 dark:text-white sm:mb-2 sm:text-lg">{topStudents[1].name}</div>
                                            <div className="mb-2 text-xs text-gray-600 dark:text-gray-300 sm:mb-3 sm:text-sm">{topStudents[1].nim}</div>
                                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                                                <Trophy className="h-4 w-4 text-gray-600 dark:text-gray-300 sm:h-5 sm:w-5" />
                                                <span className="text-base font-bold text-gray-800 dark:text-white sm:text-xl">
                                                    {topStudents[1].achievement_count}
                                                </span>
                                            </div>
                                            <div className="mt-0.5 text-[10px] text-gray-600 dark:text-gray-400 sm:mt-1 sm:text-xs">Prestasi</div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Rank 1 - Center (Tallest) */}
                                {topStudents[0] && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        className="relative flex w-full max-w-[140px] flex-col items-center sm:max-w-[220px]"
                                    >
                                        <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-2xl font-bold text-white shadow-xl sm:mb-4 sm:h-20 sm:w-20 sm:text-3xl">
                                            1
                                        </div>
                                        <div className="w-full rounded-t-lg bg-gradient-to-br from-yellow-200 to-yellow-300 p-3 pt-8 pb-10 text-center shadow-xl dark:from-yellow-600 dark:to-yellow-700 sm:p-6 sm:pt-16 sm:pb-20">
                                            <div className="mb-1 line-clamp-2 text-base font-bold text-yellow-900 dark:text-white sm:mb-2 sm:text-xl">{topStudents[0].name}</div>
                                            <div className="mb-2 text-xs text-yellow-800 dark:text-yellow-100 sm:mb-3 sm:text-sm">{topStudents[0].nim}</div>
                                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                                                <Trophy className="h-5 w-5 text-yellow-800 dark:text-yellow-100 sm:h-6 sm:w-6" />
                                                <span className="text-lg font-bold text-yellow-900 dark:text-white sm:text-2xl">
                                                    {topStudents[0].achievement_count}
                                                </span>
                                            </div>
                                            <div className="mt-0.5 text-xs text-yellow-800 dark:text-yellow-100 sm:mt-1 sm:text-sm">Prestasi</div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Rank 3 - Right (Shortest) */}
                                {topStudents[2] && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                        className="relative flex w-full max-w-[120px] flex-col items-center sm:max-w-[200px]"
                                    >
                                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-lg font-bold text-white shadow-lg sm:mb-4 sm:h-16 sm:w-16 sm:text-2xl">
                                            3
                                        </div>
                                        <div className="w-full rounded-t-lg bg-gradient-to-br from-orange-200 to-orange-300 p-3 pt-3 pb-3 text-center shadow-lg dark:from-orange-700 dark:to-orange-800 sm:p-6 sm:pt-2 sm:pb-4">
                                            <div className="mb-1 line-clamp-2 text-sm font-bold text-orange-800 dark:text-white sm:mb-2 sm:text-lg">{topStudents[2].name}</div>
                                            <div className="mb-2 text-xs text-orange-700 dark:text-orange-200 sm:mb-3 sm:text-sm">{topStudents[2].nim}</div>
                                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                                                <Trophy className="h-4 w-4 text-orange-700 dark:text-orange-200 sm:h-5 sm:w-5" />
                                                <span className="text-base font-bold text-orange-800 dark:text-white sm:text-xl">
                                                    {topStudents[2].achievement_count}
                                                </span>
                                            </div>
                                            <div className="mt-0.5 text-[10px] text-orange-700 dark:text-orange-300 sm:mt-1 sm:text-xs">Prestasi</div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-8 grid grid-cols-3 gap-3 px-2 sm:mt-12 sm:gap-6 sm:px-0"
                    >
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-white/20 bg-white/10 p-3 text-center backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50 sm:p-6"
                            >
                                <div className="mb-2 flex justify-center sm:mb-3">
                                    <div className="rounded-full bg-blue-500/20 p-2 sm:p-3">{stat.icon}</div>
                                </div>
                                <div className="mb-1 text-lg font-bold sm:text-2xl">{stat.value}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">{stat.label}</div>
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
                        className="space-y-4"
                    >
                        {/* Search */}
                        <div className="flex justify-center">
                            <div className="relative w-full max-w-md">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari prestasi atau nama mahasiswa..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-dark-base focus:border-blue-imphnen-base focus:ring-1 focus:ring-blue-imphnen-base focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-light-base dark:focus:border-blue-imphnen-secondary"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap justify-center gap-4">
                            {/* Type Filter */}
                            <select
                                value={selectedType}
                                onChange={(e) => {
                                    setSelectedType(e.target.value);
                                    handleFilter();
                                }}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-dark-base focus:border-blue-imphnen-base focus:ring-1 focus:ring-blue-imphnen-base focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-light-base"
                            >
                                <option value="all">Semua Jenis</option>
                                {types.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>

                            {/* Category Filter */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    handleFilter();
                                }}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-dark-base focus:border-blue-imphnen-base focus:ring-1 focus:ring-blue-imphnen-base focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-light-base"
                            >
                                <option value="all">Semua Kategori</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            {/* Level Filter */}
                            <select
                                value={selectedLevel}
                                onChange={(e) => {
                                    setSelectedLevel(e.target.value);
                                    handleFilter();
                                }}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-dark-base focus:border-blue-imphnen-base focus:ring-1 focus:ring-blue-imphnen-base focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-light-base"
                            >
                                <option value="all">Semua Tingkat</option>
                                {levels.map((level) => (
                                    <option key={level.id} value={level.id}>
                                        {level.name}
                                    </option>
                                ))}
                            </select>

                            {/* Year Filter */}
                            <select
                                value={selectedYear}
                                onChange={(e) => {
                                    setSelectedYear(e.target.value);
                                    handleFilter();
                                }}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-dark-base focus:border-blue-imphnen-base focus:ring-1 focus:ring-blue-imphnen-base focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-light-base"
                            >
                                <option value="all">Semua Tahun</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Submit Achievement Button */}
                        <div className="flex justify-center">
                            <a
                                href="/if-bangga/formulir"
                                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-imphnen-base to-blue-imphnen-secondary px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-md"
                            >
                                <Plus className="h-4 w-4" />
                                Ajukan Prestasi
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Achievements Grid */}
            <section className="section-padding-x bg-light-base py-16 text-dark-base dark:bg-dark-base dark:text-light-base">
                <div className="mx-auto max-w-screen-xl">
                    {achievements.data.length > 0 ? (
                        <>
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="mb-8"
                            >
                                <h2 className="mb-2 font-bold text-dark-base dark:text-light-base">Prestasi Mahasiswa</h2>
                                <div className="h-1 w-20 rounded bg-gradient-to-r from-blue-imphnen-base to-blue-imphnen-secondary"></div>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Menampilkan {achievements.from}-{achievements.to} dari {achievements.total} prestasi
                                </p>
                            </motion.div>

                            <div className="mb-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {achievements.data.map((achievement, index) => (
                                    <motion.div
                                        key={achievement.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        {/* Achievement Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            {achievement.images ? (
                                                <img
                                                    src={achievement.images[0] ? `/storage/${achievement.images[0]}` : '/img/placeholder/if-bangga.png'}
                                                    alt={achievement.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-imphnen-base to-blue-imphnen-secondary">
                                                    <Trophy className="h-16 w-16 text-white/80" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium text-white ${getLevelColor(achievement.achievement_level.name)}`}
                                                >
                                                    {achievement.achievement_level.name}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <div className="mb-3">
                                                <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    {achievement.achievement_category.name}
                                                </span>
                                                <span className="ml-2 inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                                    {achievement.achievement_type.name}
                                                </span>
                                            </div>

                                            <h3 className="mb-2 line-clamp-2 text-lg font-bold text-dark-base dark:text-light-base">
                                                {achievement.name}
                                            </h3>

                                            {achievement.description && (
                                                <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                                                    {achievement.description}
                                                </p>
                                            )}

                                            {/* Students */}
                                            <div className="mb-4">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-gray-500" />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mahasiswa:</span>
                                                </div>
                                                <div className="space-y-1">
                                                    {achievement.students.slice(0, 3).map((student) => (
                                                        <div key={student.id} className="text-sm text-gray-600 dark:text-gray-400">
                                                            {student.name} ({student.nim})
                                                        </div>
                                                    ))}
                                                    {achievement.students.length > 3 && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            +{achievement.students.length - 3} lainnya
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Date */}
                                            <div className="mb-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <Calendar className="h-3 w-3" />
                                                <span>{formatDate(achievement.awarded_at)}</span>
                                            </div>

                                            {/* Proof Link */}
                                            {achievement.proof && (
                                                <a
                                                    href={`/storage/${achievement.proof}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-imphnen-base to-blue-imphnen-secondary px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-md"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    Lihat Bukti
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
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
                                <Trophy className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Tidak Ada Prestasi Ditemukan</h3>
                            <p className="mb-4 text-gray-600 dark:text-gray-400">Coba ubah filter atau kata kunci pencarian yang digunakan.</p>
                            <a
                                href="/if-bangga/formulir"
                                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-imphnen-base to-blue-imphnen-secondary px-6 py-3 font-medium text-white transition-all duration-300 hover:scale-105"
                            >
                                <Plus className="h-4 w-4" />
                                Ajukan Prestasi Pertama
                            </a>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Call to Action */}
            <section className="section-padding-x bg-gradient-to-r from-blue-imphnen-base to-blue-imphnen-secondary py-16 text-white">
                <div className="mx-auto max-w-screen-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h2 className="mb-4 font-bold">Punya Prestasi Baru?</h2>
                        <p className="mx-auto mb-8 max-w-2xl text-white/90">
                            Bagikan prestasi membanggakan Anda dengan mengisi formulir pengajuan prestasi. Mari bersama membanggakan nama Informatika
                            Unsoed!
                        </p>
                        <a
                            href="/if-bangga/formulir"
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-blue-imphnen-base transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                            <Plus className="h-5 w-5" />
                            Ajukan Prestasi Sekarang
                        </a>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
}
