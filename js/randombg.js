

const nsfw_backgrounds = [
    'assets/images/bg.jpg',
    'assets/images/bg2.png',
    'assets/images/bg3.jpg'
];
const sfw_backgrounds = [
    'assets/images/background.png',
    'assets/images/background1.jpg',
    'assets/images/background2.jpg',
]
const background = sfw_backgrounds[Math.floor(Math.random() * sfw_backgrounds.length)];

const dim = true;
const dim_strength = 0.4;

if (dim) {
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, ${dim_strength}),rgba(0, 0, 0, ${dim_strength})), url(${background})`;
    
}else{
    document.body.style.backgroundImage = `url(${background})`;
}