const fs = require('fs');

const svgs = [
  'public/imgs/TheOracleAcademyLogo.svg',
  'public/imgs/TheOracleAcademyLogoText.svg'
];

svgs.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Remove <image ... />
  content = content.replace(/<image[^>]+>/g, '');

  content = content.replace(/\.cls-\d+[\s\r\n]*{[^}]*fill:\s*#([0-9a-fA-F]{3,6});?[^}]*}/g, (match, hex) => {
    // simplistic mapping: convert grayscale to gold scale
    const rgb = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.padStart(6, hex));
    if(!rgb) return match;
    const r = parseInt(rgb[1], 16);
    const g = parseInt(rgb[2], 16);
    const b = parseInt(rgb[3], 16);
    
    // Grayscale luminance
    const lum = 0.299*r + 0.587*g + 0.114*b;
    
    // Map luminance to a gold color scale
    // Dark gold: #8A6327
    // Mid gold: #D4AF37
    // Light gold: #F9E596
    
    let outR, outG, outB;
    if(lum < 85) {
      outR = 138; outG = 99; outB = 39;
    } else if(lum < 170) {
      outR = 212; outG = 175; outB = 55;
    } else {
      outR = 249; outG = 229; outB = 150;
    }
    
    return match.replace(/fill:\s*#[0-9a-fA-F]+/, `fill: rgb(${outR}, ${outG}, ${outB})`);
  });
  
  // Update strokes
  content = content.replace(/stroke:\s*#([0-9a-fA-F]{3,6})/g, 'stroke: rgb(212, 175, 55)');

  // Ensure fill colors not caught by regex, also mapping dark colors
  content = content.replace(/fill:\s*#1d1d1b/g, 'fill: rgb(138, 99, 39)');

  fs.writeFileSync(file, content, 'utf8');
});
console.log('Done');
