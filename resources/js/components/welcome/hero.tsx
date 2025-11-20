import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="section-padding-x relative scroll-mt-12 min-h-screen flex items-center bg-light-base bg-[url('/img/backgrounds/kabinet-arditasena.png')] bg-cover bg-center text-dark-base dark:bg-slate-950 dark:text-light-base bg-fixed pt-24 md:pt-20"
        >
            <div className="absolute inset-0 bg-light-base opacity-80 dark:bg-dark-base">
                <div className="absolute top-0 left-0 -z-10 h-72 w-72 md:h-96 md:w-96 rounded-full bg-blue-400 opacity-30 blur-3xl"></div>
            </div>
            <div className="relative mx-auto flex max-w-screen-xl flex-row justify-between gap-8 items-center w-full py-20 md:py-0">
                <motion.div
                    className="hero-animate-1 flex-1"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <div className="mb-6 rounded-lg text-dark-base dark:text-light-base space-y-4">
                        <span className="gradient-to-r mb-2 flex w-fit items-center gap-2 rounded-md bg-gradient-to-br from-blue-imphnen-base to-blue-imphnen-secondary px-3 py-1 text-light-base">
                            <svg className="w-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                <path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z" />
                            </svg>
                            <p className="extra-small-font-size">Himpunan Mahasiswa Informatika Unsoed</p>
                        </span>
                        <motion.h1
                            className="mb-4 font-bold md:text-left leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.7 }}
                        >
                            Bersama Membangun Generasi Informatika Unggul di Unsoed
                        </motion.h1>
                        <motion.p
                            className="mb-6 text-lg leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.7 }}
                        >
                            Bergabunglah bersama kami di <span className="bg-blue-imphnen-base text-light-base px-1">HMIF Unsoed</span>, wadah pengembangan
                            diri, kolaborasi, dan inovasi di bidang Informatika. Kami menyediakan berbagai kegiatan akademik, pelatihan, serta proyek
                            yang mendukung peningkatan kompetensi dan profesionalisme mahasiswa Informatika Universitas Jenderal Soedirman.
                        </motion.p>
                        <motion.div
                            className="flex gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                        >
                            <a
                                href="https://instagram.com/hmifunsoed"
                                target="_blank"
                                className="small-font-size rounded-md bg-blue-base px-4 py-2 font-semibold text-light-base transition duration-300 hover:bg-blue-quaternary hover:text-blue-base"
                            >
                                Instagram HMIF Unsoed
                            </a>
                        </motion.div>
                    </div>
                    <motion.div
                        className="flex flex-col gap-4 md:flex-row xl:justify-start mt-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                    >
                        <div className="flex items-center justify-between gap-8 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-6 text-center text-dark-base dark:text-light-base shadow-lg">
                            <div className="flex flex-col gap-2 border-r-2 border-gray-300 dark:border-gray-600 pr-6">
                                <h4 className="font-bold text-2xl">30+</h4>
                                <p className="small-font-size">Tenaga Kerja</p>
                            </div>
                            <div className="flex flex-col gap-2 border-r-2 border-gray-300 dark:border-gray-600 pr-6">
                                <h4 className="font-bold text-2xl">10+</h4>
                                <p className="small-font-size">Kegiatan Tahunan</p>
                            </div>
                            <div className="flex flex-col gap-2 pr-2">
                                <h4 className="font-bold text-2xl">1000+</h4>
                                <p className="small-font-size">Lulusan Informatika</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
                <motion.div
                    className="relative hidden lg:flex lg:items-center lg:justify-center w-full lg:w-1/3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <div className="relative w-full h-96">
                        <img src="/img/logos/hmif.png" alt="Logo HMIF Unsoed" className="absolute top-0 left-0 w-32 xl:w-48 drop-shadow-2xl" />
                        <img src="/img/logos/kabinet.png" alt="Logo Kabinet HMIF Unsoed" className="absolute right-0 bottom-0 w-28 xl:w-40 drop-shadow-2xl" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
