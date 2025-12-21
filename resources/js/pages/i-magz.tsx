import Layout from '@/components/layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, ChevronLeft, ChevronRight, Download, Eye, Search, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// // Set up PDF.js worker - Updated to match version 4.8.69
// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs';

interface Magazine {
    id: number;
    title: string;
    slug: string;
    description?: string;
    file: string;
    created_at: string;
    updated_at: string;
}

interface IMagzProps {
    magazines: Magazine[];
}

// PDF Thumbnail Component
function PDFThumbnail({ file }: { file: string }) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [error, setError] = useState(false);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setError(false);
    };

    const onDocumentLoadError = () => {
        setError(true);
    };

    if (error) {
        return (
            <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-blue-imphnen-base to-blue-imphnen-secondary">
                <BookOpen className="h-16 w-16 text-white/80" />
                <div className="absolute inset-0 bg-black/20"></div>
            </div>
        );
    }

    return (
        <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
            <div className="flex h-full items-center justify-center">
                <Document
                    file={`/storage/${file}`}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                        <div className="flex h-64 items-center justify-center bg-gradient-to-br from-blue-imphnen-base to-blue-imphnen-secondary">
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
                                <span className="text-sm text-white">Memuat preview...</span>
                            </div>
                        </div>
                    }
                    className="flex justify-center"
                >
                    <Page pageNumber={1} width={300} renderTextLayer={false} renderAnnotationLayer={false} className="shadow-lg" />
                </Document>
            </div>
            {numPages && (
                <div className="absolute top-2 right-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm">
                    {numPages} halaman
                </div>
            )}
        </div>
    );
}

export default function IMagzPage({ magazines }: IMagzProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null);
    const [showPDFViewer, setShowPDFViewer] = useState(false);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(false);

    const filteredMagazines = useMemo(() => {
        return magazines.filter(
            (magazine) =>
                magazine.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (magazine.description && magazine.description.toLowerCase().includes(searchTerm.toLowerCase())),
        );
    }, [magazines, searchTerm]);

    const stats = [
        {
            icon: <BookOpen className="h-6 w-6" />,
            label: 'Total Edisi',
            value: magazines.length.toString(),
        },
        {
            icon: <Calendar className="h-6 w-6" />,
            label: 'Edisi Terbaru',
            value: new Date().getFullYear().toString(),
        },
        {
            icon: <Download className="h-6 w-6" />,
            label: 'Format',
            value: 'PDF',
        },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const closePDFViewer = useCallback(() => {
        setShowPDFViewer(false);
        setSelectedMagazine(null);
        setNumPages(null);
        setPageNumber(1);
        setLoading(false);
    }, []);

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setLoading(false);
    }, []);

    const onDocumentLoadError = useCallback((error: Error) => {
        console.error('Error loading PDF:', error);
        setLoading(false);
    }, []);

    const previousPage = useCallback(() => {
        setPageNumber((prev) => Math.max(prev - 1, 1));
    }, []);

    const nextPage = useCallback(() => {
        setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
    }, [numPages]);

    const zoomIn = useCallback(() => {
        setScale((prev) => Math.min(prev + 0.25, 3.0));
    }, []);

    const zoomOut = useCallback(() => {
        setScale((prev) => Math.max(prev - 0.25, 0.5));
    }, []);

    const downloadMagazine = (magazine: Magazine) => {
        const link = document.createElement('a');
        link.href = `/storage/${magazine.file}`;
        link.download = `${magazine.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Tambahkan di dalam useEffect untuk keyboard navigation
    useEffect(() => {
        if (!showPDFViewer) return;

        const handleKeyPress = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    previousPage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextPage();
                    break;
                case '=':
                case '+':
                    e.preventDefault();
                    zoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    zoomOut();
                    break;
                case 'Escape':
                    e.preventDefault();
                    closePDFViewer();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [showPDFViewer, pageNumber, numPages, scale, previousPage, nextPage, zoomIn, zoomOut, closePDFViewer]);

    // Tambahkan responsive scale default
    const getResponsiveScale = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 640) return 0.8; // Mobile
            if (window.innerWidth < 1024) return 0.9; // Tablet
            return 1.0; // Desktop
        }
        return 1.0;
    };

    // Update fungsi openPDFViewer
    const openPDFViewer = (magazine: Magazine) => {
        setSelectedMagazine(magazine);
        setShowPDFViewer(true);
        setPageNumber(1);
        setScale(getResponsiveScale()); // Set responsive scale
        setLoading(true);
    };

    return (
        <Layout>
            <Head title="I-Magz HMIF Unsoed" />

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
                                <BookOpen className="h-5 w-5" />
                                <span className="text-sm font-medium">I-Magz Digital</span>
                            </span>
                        </div>
                        <h1 className="mb-4 font-bold">I-Magz HMIF Unsoed</h1>
                        <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
                            Majalah digital HMIF Unsoed yang menghadirkan informasi terkini tentang teknologi, karir, penelitian, dan kegiatan
                            mahasiswa Informatika.
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

            {/* Search Section */}
            <section className="section-padding-x bg-light-base py-8 text-dark-base dark:bg-dark-base dark:text-light-base">
                <div className="mx-auto max-w-screen-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center"
                    >
                        <div className="relative w-full max-w-md">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari edisi I-Magz..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 text-dark-base focus:border-blue-imphnen-base focus:ring-1 focus:ring-blue-imphnen-base focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-light-base dark:focus:border-blue-imphnen-secondary"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Magazines Grid */}
            <section className="section-padding-x bg-light-base py-16 text-dark-base dark:bg-dark-base dark:text-light-base">
                <div className="mx-auto max-w-screen-xl">
                    {filteredMagazines.length > 0 ? (
                        <>
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="mb-8"
                            >
                                <h2 className="mb-2 font-bold text-dark-base dark:text-light-base">Koleksi I-Magz</h2>
                                <div className="h-1 w-20 rounded bg-gradient-to-r from-blue-imphnen-base to-blue-imphnen-secondary"></div>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Menampilkan {filteredMagazines.length} edisi</p>
                            </motion.div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {filteredMagazines.map((magazine, index) => (
                                    <motion.div
                                        key={magazine.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        {/* Magazine Cover with PDF Preview */}
                                        <div className="relative">
                                            <PDFThumbnail file={magazine.file} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                            <div className="absolute right-4 bottom-4 left-4">
                                                <h3 className="text-lg leading-tight font-bold text-white drop-shadow-lg">{magazine.title}</h3>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            {magazine.description && (
                                                <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{magazine.description}</p>
                                            )}

                                            {/* Meta Info */}
                                            <div className="mb-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <Calendar className="h-3 w-3" />
                                                <span>{formatDate(magazine.created_at)}</span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openPDFViewer(magazine)}
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-imphnen-base to-blue-imphnen-secondary px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-md"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    Baca Online
                                                </button>
                                                <button
                                                    onClick={() => downloadMagazine(magazine)}
                                                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-blue-imphnen-base px-4 py-3 text-sm font-medium text-blue-imphnen-base transition-all duration-300 hover:bg-blue-imphnen-base hover:text-white"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
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
                                <BookOpen className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Tidak Ada I-Magz Ditemukan</h3>
                            <p className="text-gray-600 dark:text-gray-400">Coba ubah kata kunci pencarian yang digunakan.</p>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* PDF Viewer Modal */}
            {showPDFViewer && selectedMagazine && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 top-0 z-[999] flex flex-col bg-black/95 backdrop-blur-sm"
                >
                    {/* Header - Responsive */}
                    <div className="flex flex-col justify-between border-b border-gray-200 bg-white p-3 shadow-lg sm:flex-row sm:items-center sm:p-4 dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-3 flex-1 sm:mb-0">
                            <h3 className="line-clamp-1 text-sm font-semibold text-dark-base sm:text-base dark:text-light-base">
                                {selectedMagazine.title}
                            </h3>
                            {numPages && (
                                <p className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                                    Halaman {pageNumber} dari {numPages}
                                </p>
                            )}
                        </div>

                        {/* Controls - Responsive */}
                        <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-3">
                            {/* Navigation Controls */}
                            <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 sm:gap-2 dark:bg-gray-700">
                                <button
                                    onClick={previousPage}
                                    disabled={pageNumber <= 1}
                                    className="rounded p-1.5 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2 dark:hover:bg-gray-600"
                                    title="Halaman Sebelumnya"
                                >
                                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                                </button>

                                <div className="min-w-[60px] px-2 text-center text-xs text-dark-base sm:text-sm dark:text-light-base">
                                    {pageNumber} / {numPages || 0}
                                </div>

                                <button
                                    onClick={nextPage}
                                    disabled={pageNumber >= (numPages || 0)}
                                    className="rounded p-1.5 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2 dark:hover:bg-gray-600"
                                    title="Halaman Selanjutnya"
                                >
                                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                </button>
                            </div>

                            {/* Zoom Controls */}
                            <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                                <button
                                    onClick={zoomOut}
                                    disabled={scale <= 0.5}
                                    className="rounded p-1.5 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2 dark:hover:bg-gray-600"
                                    title="Perkecil"
                                >
                                    <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
                                </button>

                                <div className="min-w-[45px] px-2 text-center text-xs text-dark-base sm:text-sm dark:text-light-base">
                                    {Math.round(scale * 100)}%
                                </div>

                                <button
                                    onClick={zoomIn}
                                    disabled={scale >= 3.0}
                                    className="rounded p-1.5 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2 dark:hover:bg-gray-600"
                                    title="Perbesar"
                                >
                                    <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 sm:gap-2">
                                <button
                                    onClick={() => downloadMagazine(selectedMagazine)}
                                    className="rounded-lg bg-blue-imphnen-base p-1.5 text-white shadow-md transition-colors hover:bg-blue-imphnen-secondary sm:p-2"
                                    title="Download PDF"
                                >
                                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                                </button>

                                <button
                                    onClick={closePDFViewer}
                                    className="rounded-lg bg-red-500 p-1.5 text-white shadow-md transition-colors hover:bg-red-600 sm:p-2"
                                    title="Tutup"
                                >
                                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* PDF Content - Improved Responsive Layout */}
                    <div className="flex-1 overflow-hidden bg-gray-200 dark:bg-gray-800">
                        <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700 h-full overflow-auto">
                            <div className="flex min-h-full items-start justify-center p-2 sm:p-4">
                                {loading && (
                                    <div className="flex h-full items-center justify-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
                                            <div className="text-sm text-white">Memuat PDF...</div>
                                        </div>
                                    </div>
                                )}

                                <div className="w-full max-w-4xl">
                                    <Document
                                        file={`/storage/${selectedMagazine.file}`}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        onLoadError={onDocumentLoadError}
                                        loading={
                                            <div className="flex h-96 items-center justify-center rounded-lg bg-white shadow-lg">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                                                    <div className="text-sm text-gray-600">Memuat halaman...</div>
                                                </div>
                                            </div>
                                        }
                                        className="flex justify-center"
                                    >
                                        <div className="relative">
                                            <Page
                                                pageNumber={pageNumber}
                                                scale={scale}
                                                className="overflow-hidden rounded-lg bg-white shadow-xl"
                                                loading={
                                                    <div className="flex h-96 w-full items-center justify-center rounded-lg bg-white shadow-lg">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                                                            <div className="text-sm text-gray-600">Memuat halaman...</div>
                                                        </div>
                                                    </div>
                                                }
                                                renderTextLayer={true}
                                                renderAnnotationLayer={true}
                                            />

                                            {/* Page Navigation Overlay - Mobile */}
                                            <div className="absolute inset-0 flex md:hidden">
                                                {/* Left tap area */}
                                                <button
                                                    onClick={previousPage}
                                                    disabled={pageNumber <= 1}
                                                    className="flex-1 bg-black opacity-0 transition-opacity hover:opacity-10 disabled:cursor-not-allowed"
                                                    aria-label="Halaman Sebelumnya"
                                                />

                                                {/* Right tap area */}
                                                <button
                                                    onClick={nextPage}
                                                    disabled={pageNumber >= (numPages || 0)}
                                                    className="flex-1 bg-black opacity-0 transition-opacity hover:opacity-10 disabled:cursor-not-allowed"
                                                    aria-label="Halaman Selanjutnya"
                                                />
                                            </div>
                                        </div>
                                    </Document>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Bottom Navigation - Optional */}
                    <div className="block border-t border-gray-200 bg-white p-3 sm:hidden dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={previousPage}
                                disabled={pageNumber <= 1}
                                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Sebelumnya
                            </button>

                            <button
                                onClick={nextPage}
                                disabled={pageNumber >= (numPages || 0)}
                                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white"
                            >
                                Selanjutnya
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Keyboard Navigation Hint */}
                    <div className="absolute bottom-4 left-4 hidden rounded-lg bg-black/70 px-3 py-2 text-xs text-white sm:block">
                        <div className="flex items-center gap-4">
                            <span>← → Navigasi</span>
                            <span>+ - Zoom</span>
                            <span>Esc Tutup</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Info Section */}
            <section className="section-padding-x bg-gray-50 py-16 text-dark-base dark:bg-gray-900 dark:text-light-base">
                <div className="mx-auto max-w-screen-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h2 className="mb-4 font-bold text-dark-base dark:text-light-base">Tentang I-Magz</h2>
                        <div className="mx-auto max-w-3xl">
                            <p className="mb-6 text-gray-600 dark:text-gray-400">
                                I-Magz adalah majalah digital resmi HMIF Unsoed yang terbit secara berkala. Majalah ini berisi artikel-artikel menarik
                                seputar teknologi, tips karir, penelitian, dan berbagai kegiatan mahasiswa Informatika.
                            </p>
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="text-center">
                                    <div className="mb-3 flex justify-center">
                                        <BookOpen className="h-8 w-8 text-blue-imphnen-base" />
                                    </div>
                                    <h3 className="mb-2 font-semibold">Konten Berkualitas</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Artikel dan konten yang informatif dan relevan</p>
                                </div>
                                <div className="text-center">
                                    <div className="mb-3 flex justify-center">
                                        <Download className="h-8 w-8 text-blue-imphnen-base" />
                                    </div>
                                    <h3 className="mb-2 font-semibold">Akses Mudah</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Baca online atau download untuk dibaca offline</p>
                                </div>
                                <div className="text-center">
                                    <div className="mb-3 flex justify-center">
                                        <Calendar className="h-8 w-8 text-blue-imphnen-base" />
                                    </div>
                                    <h3 className="mb-2 font-semibold">Terbit Berkala</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Edisi baru terbit secara rutin setiap periode</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
}
