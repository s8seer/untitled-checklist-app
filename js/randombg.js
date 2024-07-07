const backgrounds = [
    'assets/images/background.png',
    'assets/images/background1.jpg',
    'assets/images/background2.jpg',
]
const background = backgrounds[Math.floor(Math.random() * backgrounds.length)];

const dim = true;
const dim_strength = 0.4;

if (dim) {
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, ${dim_strength}),rgba(0, 0, 0, ${dim_strength})), url(${background})`;
    
}else{
    document.body.style.backgroundImage = `url(${background})`;
}