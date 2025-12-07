import Layout from '@/components/layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Check, Clock, Copy, Facebook, Phone, Twitter, User } from 'lucide-react';
import { useState } from 'react';

interface Author {
    id: number;
    name: string;
    email?: string;
    bio?: string;
    avatar?: string;
}

interface Category {
    id: number;
    name: string;
    slug?: string;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    thumbnail?: string;
    content: string;
    created_at: string;
    updated_at: string;
    author: Author;
    category: Category;
}

interface ArticleShowProps {
    article: Article;
    relatedArticles: Article[];
    recentArticles: Article[];
}

// Data dummy untuk development
const dummyArticle: Article = {
    id: 1,
    title: 'Menyambut Era Artificial Intelligence: Peluang dan Tantangan untuk Mahasiswa Informatika',
    slug: 'menyambut-era-artificial-intelligence-peluang-dan-tantangan',
    thumbnail: '/img/articles/ai-future.jpg',
    content: `
        <p>Era Artificial Intelligence (AI) telah tiba dan mengubah lanskap teknologi secara fundamental. Sebagai mahasiswa Informatika, kita berada di garis depan revolusi teknologi ini dan memiliki peluang besar untuk menjadi bagian dari perubahan yang akan membentuk masa depan.</p>

        <h2>Peluang di Era AI</h2>
        <p>Perkembangan AI membuka berbagai peluang karir baru yang menjanjikan:</p>
        
        <h3>1. Machine Learning Engineer</h3>
        <p>Profesi ini sangat dibutuhkan untuk mengembangkan algoritma dan model AI yang dapat belajar dari data. Dengan pemahaman yang kuat tentang matematika, statistik, dan programming, mahasiswa Informatika memiliki fondasi yang solid untuk berkarir di bidang ini.</p>

        <h3>2. Data Scientist</h3>
        <p>Data adalah bahan bakar utama AI. Data scientist bertugas menganalisis data besar untuk menemukan pola dan insight yang berharga bagi bisnis. Kemampuan programming dan analisis yang dipelajari di Informatika sangat relevan untuk profesi ini.</p>

        <h3>3. AI Product Manager</h3>
        <p>Menggabungkan pemahaman teknis dengan skill bisnis, AI Product Manager bertugas mengarahkan pengembangan produk berbasis AI yang dapat memecahkan masalah nyata di masyarakat.</p>

        <h2>Tantangan yang Harus Dihadapi</h2>
        <p>Namun, era AI juga membawa tantangan yang perlu kita antisipasi:</p>

        <h3>1. Kompetisi Global</h3>
        <p>Industri AI berkembang sangat cepat dengan kompetisi yang ketat. Mahasiswa harus terus mengupdate skill dan pengetahuan untuk tetap relevan di pasar kerja global.</p>

        <h3>2. Ethical AI</h3>
        <p>Pengembangan AI harus mempertimbangkan aspek etika dan dampak sosial. Mahasiswa perlu memahami tidak hanya aspek teknis, tetapi juga implikasi moral dari teknologi yang dikembangkan.</p>

        <h3>3. Kebutuhan Skill Interdisipliner</h3>
        <p>AI tidak hanya tentang coding, tetapi juga membutuhkan pemahaman domain bisnis, psikologi, dan ilmu sosial lainnya.</p>

        <h2>Tips Mempersiapkan Diri</h2>
        <p>Berikut beberapa langkah yang bisa diambil mahasiswa Informatika untuk mempersiapkan diri:</p>

        <ol>
            <li><strong>Pelajari Machine Learning dan Deep Learning</strong> - Mulai dari konsep dasar hingga implementasi praktis</li>
            <li><strong>Bangun Portfolio Project</strong> - Kerjakan proyek-proyek AI yang dapat mendemonstrasikan kemampuan Anda</li>
            <li><strong>Ikuti Online Course dan Certification</strong> - Platform seperti Coursera, edX, dan Udacity menawarkan course berkualitas</li>
            <li><strong>Join AI Community</strong> - Bergabung dengan komunitas AI lokal maupun international untuk networking</li>
            <li><strong>Praktik Problem Solving</strong> - Latihan algoritma dan data structure tetap penting</li>
        </ol>

        <h2>Kesimpulan</h2>
        <p>Era AI menawarkan peluang yang sangat menarik bagi mahasiswa Informatika. Dengan persiapan yang tepat dan mindset continuous learning, kita dapat mengambil keuntungan dari revolusi teknologi ini. Yang terpenting adalah tetap adaptif dan selalu siap belajar hal-hal baru.</p>

        <p>HMIF Unsoed berkomitmen untuk mendukung mahasiswa dalam menghadapi tantangan era AI ini melalui berbagai program dan kegiatan yang relevan. Mari bersama-sama menyambut masa depan teknologi dengan persiapan yang matang!</p>
    `,
    created_at: '2024-03-15T10:30:00.000000Z',
    updated_at: '2024-03-15T10:30:00.000000Z',
    author: {
        id: 1,
        name: 'Dr. Ahmad Santoso, M.Kom',
        email: 'ahmad.santoso@unsoed.ac.id',
        bio: 'Dosen Informatika Unsoed dengan spesialisasi Machine Learning dan AI. Aktif dalam penelitian dan pengembangan teknologi AI.',
        avatar: '/img/authors/ahmad-santoso.jpg',
    },
    category: {
        id: 1,
        name: 'Teknologi',
        slug: 'teknologi',
    },
};

const dummyRelatedArticles: Article[] = [
    {
        id: 2,
        title: 'Panduan Lengkap Belajar Machine Learning untuk Pemula',
        slug: 'panduan-lengkap-belajar-machine-learning-untuk-pemula',
        thumbnail: '/img/articles/ml-guide.jpg',
        content: 'Panduan komprehensif untuk memulai belajar machine learning...',
        created_at: '2024-03-10T14:20:00.000000Z',
        updated_at: '2024-03-10T14:20:00.000000Z',
        author: dummyArticle.author,
        category: dummyArticle.category,
    },
    {
        id: 3,
        title: 'Tips Sukses Interview Data Scientist di Perusahaan Tech',
        slug: 'tips-sukses-interview-data-scientist-di-perusahaan-tech',
        thumbnail: '/img/articles/interview-tips.jpg',
        content: 'Strategi dan tips untuk sukses dalam interview posisi data scientist...',
        created_at: '2024-03-08T09:15:00.000000Z',
        updated_at: '2024-03-08T09:15:00.000000Z',
        author: dummyArticle.author,
        category: dummyArticle.category,
    },
];

export default function ArticleShow({
    article = dummyArticle,
    relatedArticles = dummyRelatedArticles,
    recentArticles = dummyRelatedArticles,
}: ArticleShowProps) {
    const [copySuccess, setCopySuccess] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} menit baca`;
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = article.title;

    const shareToFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    const shareToTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank');
    };

    const shareToWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`, '_blank');
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const truncateTitle = (title: string, maxLength: number = 60) => {
        if (title.length <= maxLength) return title;
        return title.substring(0, maxLength) + '...';
    };

    return (
        <Layout>
            <Head title={`${article.title} - HMIF Unsoed`} />

            {/* Breadcrumb */}
            <section className="section-padding-x bg-light-base pt-32 pb-8 text-dark-base dark:bg-dark-base dark:text-light-base">
                <div className="mx-auto max-w-screen-xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Link
                            href="/berita"
                            className="inline-flex items-center gap-2 text-blue-imphnen-base transition-colors duration-300 hover:text-blue-imphnen-secondary"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="text-sm font-medium">Kembali ke Berita</span>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Article Content */}
            <section className="section-padding-x bg-light-base pb-16 text-dark-base dark:bg-dark-base dark:text-light-base">
                <div className="mx-auto max-w-screen-xl">
                    <div className="grid gap-12 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <motion.article
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="prose prose-lg prose-gray dark:prose-invert max-w-none"
                            >
                                {/* Article Header */}
                                <header className="mb-8">
                                    {/* Category */}
                                    <div className="mb-4">
                                        <span className="inline-block rounded-full bg-blue-imphnen-base px-3 py-1 text-sm font-medium text-white">
                                            {article.category.name}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h1 className="mb-6 leading-tight font-bold text-dark-base dark:text-light-base">{article.title}</h1>

                                    {/* Meta Info */}
                                    <div className="mb-6 flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>{formatDate(article.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            <span>{article.author.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>{getReadingTime(article.content)}</span>
                                        </div>
                                    </div>

                                    {/* Featured Image */}
                                    {article.thumbnail && (
                                        <div className="mb-8 overflow-hidden rounded-lg">
                                            <img src={`/storage/${article.thumbnail}`} alt={article.title} className="h-auto w-full object-cover" />
                                        </div>
                                    )}
                                </header>

                                {/* Article Content */}
                                <div
                                    className="prose prose-lg prose-gray dark:prose-invert prose-headings:text-dark-base dark:prose-headings:text-light-base prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-dark-base dark:prose-strong:text-light-base prose-ol:text-gray-700 dark:prose-ol:text-gray-300 prose-ul:text-gray-700 dark:prose-ul:text-gray-300 max-w-none"
                                    dangerouslySetInnerHTML={{ __html: article.content }}
                                />

                                {/* Share Buttons */}
                                <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bagikan artikel:</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={shareToFacebook}
                                                className="rounded-full bg-blue-600 p-2 text-white transition-colors duration-300 hover:bg-blue-700"
                                                title="Share to Facebook"
                                            >
                                                <Facebook className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={shareToTwitter}
                                                className="rounded-full bg-blue-400 p-2 text-white transition-colors duration-300 hover:bg-blue-500"
                                                title="Share to Twitter"
                                            >
                                                <Twitter className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={shareToWhatsApp}
                                                className="rounded-full bg-green-500 p-2 text-white transition-colors duration-300 hover:bg-green-600"
                                                title="Share to WhatsApp"
                                            >
                                                <Phone className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={copyToClipboard}
                                                className="rounded-full bg-gray-600 p-2 text-white transition-colors duration-300 hover:bg-gray-700"
                                                title="Copy Link"
                                            >
                                                {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Author Info */}
                                <div className="mt-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            {article.author.avatar ? (
                                                <img
                                                    src={article.author.avatar}
                                                    alt={article.author.name}
                                                    className="h-16 w-16 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-imphnen-base to-blue-imphnen-secondary text-lg font-semibold text-white">
                                                    {article.author.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="mb-1 font-semibold text-dark-base dark:text-light-base">{article.author.name}</h3>
                                            {article.author.bio && <p className="text-sm text-gray-600 dark:text-gray-400">{article.author.bio}</p>}
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Related Articles */}
                            {relatedArticles.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <h3 className="mb-4 font-bold text-dark-base dark:text-light-base">Artikel Terkait</h3>
                                    <div className="space-y-4">
                                        {relatedArticles.map((relatedArticle, index) => (
                                            <motion.div
                                                key={relatedArticle.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                            >
                                                <Link href={`/berita/${relatedArticle.slug}`} className="group block">
                                                    <h4 className="line-clamp-2 text-sm font-medium text-dark-base transition-colors duration-300 group-hover:text-blue-imphnen-base dark:text-light-base">
                                                        {truncateTitle(relatedArticle.title)}
                                                    </h4>
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        {formatDate(relatedArticle.created_at)}
                                                    </p>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Recent Articles */}
                            {recentArticles.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <h3 className="mb-4 font-bold text-dark-base dark:text-light-base">Artikel Terbaru</h3>
                                    <div className="space-y-4">
                                        {recentArticles.map((recentArticle, index) => (
                                            <motion.div
                                                key={recentArticle.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                            >
                                                <Link href={`/berita/${recentArticle.slug}`} className="group block">
                                                    <h4 className="mb-1 line-clamp-2 text-sm font-medium text-dark-base transition-colors duration-300 group-hover:text-blue-imphnen-base dark:text-light-base">
                                                        {truncateTitle(recentArticle.title)}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(recentArticle.created_at)}</p>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
