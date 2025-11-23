import { motion } from 'framer-motion';
import { Calendar, Clock, FileText, ExternalLink } from 'lucide-react';

interface Form {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    description: string;
    start_date: string;
    end_date: string | null;
    is_active: boolean;
}

interface LatestFormsSectionProps {
    forms: Form[];
}

export default function LatestFormsSection({ forms }: LatestFormsSectionProps) {
    if (!forms || forms.length === 0) {
        return null;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    const getDaysRemaining = (endDate: string) => {
        const now = new Date();
        const end = new Date(endDate);
        const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    return (
        <section className="section-padding-x bg-gray-50 dark:bg-gray-800 py-16 text-dark-base dark:text-light-base">
            <div className="mx-auto max-w-screen-xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-12 text-center"
                >
                    <h2 className="mb-4 font-bold text-dark-base dark:text-light-base">Formulir Terbaru</h2>
                    <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
                        Lihat dan isi formulir yang sedang dibuka. Jangan lewatkan kesempatan untuk berpartisipasi dalam kegiatan HMIF
                    </p>
                </motion.div>

                {/* Grid of Form Cards */}
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {forms.map((form, index) => {
                        return (
                            <motion.div
                                key={form.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group"
                            >
                                <a href={`/forms/${form.slug}`} rel="noopener noreferrer">
                                    <div className="relative h-full rounded-3xl bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition-all duration-300 overflow-hidden border-2 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 group-hover:-translate-y-1">
                                        
                                        <div className="relative">
                                            {/* Thumbnail/Image Container */}
                                            <div className="relative h-48 overflow-hidden">
                                                {form.thumbnail ? (
                                                    <>
                                                        <img
                                                            src={'/storage/'+form.thumbnail}
                                                            alt={form.title}
                                                            className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent dark:from-black/80"></div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700"></div>
                                                        <div className="absolute inset-0 opacity-20">
                                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white dark:via-white/50 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
                                                        </div>
                                                        <div className="relative z-10 h-full flex items-center justify-center">
                                                            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-5 border border-white/20 group-hover:scale-110 transition-all duration-500">
                                                                <FileText className="h-16 w-16 text-white drop-shadow-lg" strokeWidth={1.5} />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                
                                                {/* Status Badge */}
                                                <div className="absolute top-4 right-4 z-10">
                                                    <div className="px-3 py-1 rounded-full bg-green-500/90 dark:bg-green-600/90 backdrop-blur-sm flex items-center gap-1 text-white text-xs font-semibold shadow-lg dark:shadow-green-900/50">
                                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                                        Aktif
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card Content */}
                                            <div className="p-6">
                                                {/* Title */}
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                                    {form.title}
                                                </h3>
                                                
                                                {/* Description */}
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-4 line-clamp-3">
                                                    {form.description}
                                                </p>

                                                {/* Date Info */}
                                                {form.end_date && (() => {
                                                    const endDate = form.end_date!;
                                                    const daysRemaining = getDaysRemaining(endDate);
                                                    return (
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                                        <span>Berakhir: {formatDate(endDate)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Clock className={`h-4 w-4 ${
                                                            daysRemaining <= 3 
                                                                ? 'text-red-600 dark:text-red-400' 
                                                                : daysRemaining <= 7 
                                                                    ? 'text-orange-600 dark:text-orange-400'
                                                                    : 'text-green-600 dark:text-green-400'
                                                        }`} />
                                                        <span className={`font-semibold ${
                                                            daysRemaining <= 3 
                                                                ? 'text-red-600 dark:text-red-400' 
                                                                : daysRemaining <= 7 
                                                                    ? 'text-orange-600 dark:text-orange-400'
                                                                    : 'text-green-600 dark:text-green-400'
                                                        }`}>
                                                            {daysRemaining} hari lagi
                                                        </span>
                                                    </div>
                                                </div>
                                                    );
                                                })()}

                                                {/* CTA Button */}
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 transition-colors">
                                                        Lihat Detail
                                                    </span>
                                                    <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </motion.div>
                        );
                    })}
                </div>

                {/* View All Forms Link */}
                {forms.length === 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-12 text-center"
                    >
                        <a
                            href="/forms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-lg dark:hover:shadow-blue-900/50 transition-all duration-300"
                        >
                            <span>Lihat Semua Formulir</span>
                            <ExternalLink className="h-5 w-5" />
                        </a>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
