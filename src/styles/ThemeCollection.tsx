import z8008 from './themes/8008';
import aether from './themes/aether';
import z80s_after_dark from './themes/80s_after_dark';
import z9009 from './themes/9009';
import alduin from './themes/alduin';
import arch from './themes/arch';
import bento from './themes/bento';
import alpine from './themes/alpine';
import bingsu from './themes/bingsu';
import bliss from './themes/bliss';
import botanical from './themes/botanical';
import cafe from './themes/cafe';
import bushido from './themes/bushido';
import camping from './themes/camping';
import carbon from './themes/carbon';
import cyberspace from './themes/cyberspace';
import dark from './themes/dark';
import copper from './themes/copper';
import dark_magic_girl from './themes/dark_magic_girl';
import deku from './themes/deku';
import dots from './themes/dots';
import dracula from './themes/dracula';
import darling from './themes/darling';
import dollar from './themes/dollar';
import drowning from './themes/drowning';
import dualshot from './themes/dualshot';
import froyo from './themes/froyo';
import fundamentals from './themes/fundamentals';
import future_funk from './themes/future_funk';
import graen from './themes/graen';
import gruvbox_dark from './themes/gruvbox_dark';
import gruvbox_light from './themes/gruvbox_light';
import hammerhead from './themes/hammerhead';
import honey from './themes/honey';
import iceberg_light from './themes/iceberg_light';
import iceberg_dark from './themes/iceberg_dark';
import ishtar from './themes/ishtar';
import joker from './themes/joker';
import laser from './themes/laser';
import lavender from './themes/lavender';
import lime from './themes/lime';
import lil_dragon from './themes/lil_dragon';
import magic_girl from './themes/magic_girl';
import luna from './themes/luna';
import matrix from './themes/matrix';
import mashu from './themes/mashu';
import matcha_moccha from './themes/matcha_moccha';
import menthol from './themes/menthol';
import metaverse from './themes/metaverse';
import metropolis from './themes/metropolis';
import miami from './themes/miami';
import miami_nights from './themes/miami_nights';
import milkshake from './themes/milkshake';
import mint from './themes/mint';
import mizu from './themes/mizu';
import modern_dolch from './themes/modern_dolch';
import monokai from './themes/monokai';
import mr_sleeves from './themes/mr_sleeves';
import ms_cupcakes from './themes/ms_cupcakes';
import nausea from './themes/nausea';
import nebula from './themes/nebula';
import nautilus from './themes/nautilus';
import night_runner from './themes/night_runner';
import nord from './themes/nord';
import norse from './themes/norse';
import olive from './themes/olive';
import oblivion from './themes/oblivion';
import onedark from './themes/onedark';
import olivia from './themes/olivia';
import paper from './themes/paper';
import pastel from './themes/pastel';
import red_dragon from './themes/red_dragon';
import red_samurai from './themes/red_samurai';
import pulse from './themes/pulse';
import repose_dark from './themes/repose_dark';
import repose_light from './themes/repose_light';
import retro from './themes/retro';
import rgb from './themes/rgb';
import retrocast from './themes/retrocast';
import rose_pine from './themes/rose_pine';
import rose_pine_dawn from './themes/rose_pine_dawn';
import rudy from './themes/rudy';
import rose_pine_moon from './themes/rose_pine_moon';
import serika_dark from './themes/serika_dark';
import serika from './themes/serika';
import shadow from './themes/shadow';
import solarized_dark from './themes/solarized_dark';
import shoko from './themes/shoko';
import solarized_light from './themes/solarized_light';
import sonokai from './themes/sonokai';
import stealth from './themes/stealth';
import strawberry from './themes/strawberry';
import striker from './themes/striker';
import superuser from './themes/superuser';
import sweden from './themes/sweden';
import taro from './themes/taro';
import terminal from './themes/terminal';
import terra from './themes/terra';
import vaporwave from './themes/vaporwave';
import voc from './themes/voc';
import watermelon from './themes/watermelon';
import wavez from './themes/wavez';

interface ThemeCollection {
    [index: string]: bTheme
}

// interface Theme {
//     '--bgr-color': string,
//     '--bgr-deep' : string,
//     '--pri-color': string,
//     '--pri-deep' : string,
//     '--sub-color': string,
//     '--emp-color': string
// }

interface bTheme {
    '--bg-color': string,
    '--caret-color': string,
    '--main-color': string,
    '--sub-color': string,
    '--text-color': string,
    '--error-color': string,
    '--error-extra-color': string,
    '--colorful-error-color': string,
    '--colorful-error-extra-color': string
}

const themes: ThemeCollection = {
    '8008': z8008,
    'aether': aether,
    '9009': z9009,
    '80s_after_dark': z80s_after_dark,
    'alpine': alpine,
    'alduin': alduin,
    'bento': bento,
    'arch': arch,
    'bingsu': bingsu,
    'botanical': botanical,
    'bliss': bliss,
    'bushido': bushido,
    'cafe': cafe,
    'camping': camping,
    'carbon': carbon,
    'copper': copper,
    'cyberspace': cyberspace,
    'dark': dark,
    'dark_magic_girl': dark_magic_girl,
    'darling': darling,
    'deku': deku,
    'dollar': dollar,
    'dots': dots,
    'dracula': dracula,
    'drowning': drowning,
    'dualshot': dualshot,
    'froyo': froyo,
    'future_funk': future_funk,
    'fundamentals': fundamentals,
    'graen': graen,
    'gruvbox_light': gruvbox_light,
    'gruvbox_dark': gruvbox_dark,
    'hammerhead': hammerhead,
    'honey': honey,
    'iceberg_dark': iceberg_dark,
    'iceberg_light': iceberg_light,
    'ishtar': ishtar,
    'joker': joker,
    'laser': laser,
    'lavender': lavender,
    'lime': lime,
    'lil_dragon': lil_dragon,
    'luna': luna,
    'magic_girl': magic_girl,
    'matcha_moccha': matcha_moccha,
    'matrix': matrix,
    'mashu': mashu,
    'menthol': menthol,
    'metaverse': metaverse,
    'metropolis': metropolis,
    'miami': miami,
    'miami_nights': miami_nights,
    'milkshake': milkshake,
    'mint': mint,
    'modern_dolch': modern_dolch,
    'mizu': mizu,
    'monokai': monokai,
    'mr_sleeves': mr_sleeves,
    'ms_cupcakes': ms_cupcakes,
    'nausea': nausea,
    'nautilus': nautilus,
    'nebula': nebula,
    'night_runner': night_runner,
    'nord': nord,
    'norse': norse,
    'oblivion': oblivion,
    'olive': olive,
    'olivia': olivia,
    'onedark': onedark,
    'paper': paper,
    'pastel': pastel,
    'pulse': pulse,
    'red_dragon': red_dragon,
    'red_samurai': red_samurai,
    'repose_dark': repose_dark,
    'repose_light': repose_light,
    'retro': retro,
    'retrocast': retrocast,
    'rgb': rgb,
    'rose_pine': rose_pine,
    'rose_pine_dawn': rose_pine_dawn,
    'rose_pine_moon': rose_pine_moon,
    'rudy': rudy,
    'serika': serika,
    'serika_dark': serika_dark,
    'shadow': shadow,
    'shoko': shoko,
    'solarized_dark': solarized_dark,
    'solarized_light': solarized_light,
    'sonokai': sonokai,
    'stealth': stealth,
    'strawberry': strawberry,
    'striker': striker,
    'superuser': superuser,
    'sweden': sweden,
    'taro': taro,
    'terminal': terminal,
    'terra': terra,
    'vaporwave': vaporwave,
    'voc': voc,
    'watermelon': watermelon,
    'wavez': wavez
}

export default themes;
export type { bTheme };