export type Product = {
    id: number;
    title: string;
    category: string;
    price: number;
    originalPrice: number;
    discount: number;
    desc: string;
    image: string;
    tag: string;
};

export const products: Product[] = [
    {
        id: 1,
        title: "Velvet Chronograph AP Black",
        category: "Watches",
        price: 2450000,
        originalPrice: 3500000,
        discount: 30,
        desc: "An elite AP Royal Oak custom edition styled in sleek purple diamond carbon and 18k bright pink-gold accents. Complete with self-winding Calibre swiss movement.",
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=500&q=80",
        tag: "LIMITED EDITION"
    },
    {
        id: 2,
        title: "Imperial Rose VVS Ring",
        category: "Jewelry",
        price: 4800000,
        originalPrice: 6000000,
        discount: 20,
        desc: "Handcrafted 24k polished rose-gold ring with customized hand-set VVS brilliant cut pink diamonds in a stunning star cluster pattern.",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=500&q=80",
        tag: "EXCLUSIVE MASTERPIECE"
    },
    {
        id: 3,
        title: "Midnight Saffron Rose Elixir",
        category: "Fragrances",
        price: 185000,
        originalPrice: 231250,
        discount: 20,
        desc: "Concentrated signature perfume curated with raw natural saffron, dark amber, pink gold flakes, and high-intensity black rose oud notes.",
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80",
        tag: "BEST SELLER"
    },
    {
        id: 4,
        title: "Pink-Stitched Velvet Carryall",
        category: "Leather Goods",
        price: 1250000,
        originalPrice: 1562500,
        discount: 20,
        desc: "Made with genuine Italian full-grain black calfskin leather, handstitched with rose-coated metallic threads and customized pink-gold locks.",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80",
        tag: "NEW ATELIER DROP"
    },
    {
        id: 5,
        title: "Rose Gold Polarized Aviators",
        category: "Apparel",
        price: 320000,
        originalPrice: 400000,
        discount: 20,
        desc: "24k rose gold-plated frames showcasing customized monogram engraving, complete with deep velvet polarized sapphire glass.",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80",
        tag: "TRENDING EDITS"
    },
    {
        id: 6,
        title: "Vanguard Rose timezone Timepiece",
        category: "Watches",
        price: 3890000,
        originalPrice: 4862500,
        discount: 20,
        desc: "A structural design feat showing dual timezone dials in deep slate black and orchid-finished complications, with custom crocodile straps.",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=500&q=80",
        tag: "PRIVATE VAULT SELECTION"
    },
    {
        id: 7,
        title: "Sovereign Rose Interlinked Chain",
        category: "Jewelry",
        price: 1950000,
        originalPrice: 2600000,
        discount: 25,
        desc: "Meticulously intertwined heavy chain made from 100% certified pure recycled 22k rose gold links.",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80",
        tag: "HOT SELLER"
    },
    {
        id: 8,
        title: "Night Velvet Couture Hand Bag",
        category: "Leather Goods",
        price: 2990000,
        originalPrice: 3986600,
        discount: 25,
        desc: "Mirror-shine dark patent leather exterior with a pink gold clasp handle mimicking royal hardware, with signature velvet black interior.",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=80",
        tag: "ATELIER COUTURE"
    }
];

export const heroSlides = [
    {
        img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1800&q=80",
        title: "The Sovereignty <br>Of <span class='text-gradient bg-gradient-to-r from-luxePink-500 via-fuchsia-400 to-pink-200 text-transparent bg-clip-text'>Velvet & Rose</span>",
        desc: "Step inside the world's most luxurious catalog of limited horology, fine gems, and masterfully tailored leather pieces designed exclusively in deep shades of velvet purple and solid pink."
    },
    {
        img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=80",
        title: "The Diamond Star <br><span class='text-gradient bg-gradient-to-r from-luxePink-500 via-fuchsia-400 to-pink-200 text-transparent bg-clip-text'>Heritage Jewelry</span>",
        desc: "Every dynamic stone is curated and verified before placement. Browse through pure gold rings, heavy links, and precious certified gems."
    },
    {
        img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1800&q=80",
        title: "Gilded Velvet <br><span class='text-gradient bg-gradient-to-r from-luxePink-500 via-fuchsia-400 to-pink-200 text-transparent bg-clip-text'>Couture Carryalls</span>",
        desc: "Experience handstitched premium calfskin bags embellished with pink-gold hardware and luxury velvet linings."
    }
];
