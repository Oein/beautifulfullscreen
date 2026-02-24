# Beautiful Fullscreen

[![CodeFactor](https://www.codefactor.io/repository/github/oein/beautifulfullscreen/badge)](https://www.codefactor.io/repository/github/oein/beautifulfullscreen)

Minimal album cover art display with beautiful blur effect background. Activating button locates in top bar. While in display mode, double click anywhere to exit. Right click anywhere to open setting menu. Now also includes lyrics if `lyrics-plus` custom app installed.

![Screenshot](https://raw.githubusercontent.com/Oein/beautifulfullscreen/main/images/preview.gif)

|                                                                                             |                                                                                             |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| ![Screenshot](https://raw.githubusercontent.com/Oein/beautifulfullscreen/main/images/1.png) | ![Screenshot](https://raw.githubusercontent.com/Oein/beautifulfullscreen/main/images/2.png) |
| ![Screenshot](https://raw.githubusercontent.com/Oein/beautifulfullscreen/main/images/3.png) | ![Screenshot](https://raw.githubusercontent.com/Oein/beautifulfullscreen/main/images/5.png) |

## Supported Options

- Blured cover art as background
- lyrics-plus support (if `lyrics-plus` custom app installed)
- ivLyrics support (if `ivlyrics` custom app installed)
- Clock display
- Customizable font size and color
- Vertical mode
- Customizable alignment (left, center, right), placement (left, center, right)
- Controls (play/pause, next, previous) support
- Advanced controls (shuffle, repeat) support
- Volume control support
- Automatic start when spotify launched
- Replace spotify's default fullscreen button

## Installation

### With Marketplace (Recommended)

1. Install [Marketplace](https://github.com/spicetify/spicetify-marketplace)
2. Go to marketplace and install `beautifulfullscreen`

### Manually

1. Download latest extension build at [dist/beautiful-fullscreen.js](https://github.com/Oein/beautifulfullscreen/blob/main/dist/beautiful-fullscreen).
2. Put `beautiful-fullscreen.js` into `Spicetify\Extensions` folder.
   See [Spicetify's Docs](https://spicetify.app/docs/advanced-usage/extensions#installing) to find your extensions folder.
3. Run command

```sh
spicetify config extensions beautiful-fullscreen.js
spicetify apply
```

## Usage

- Open : Click play button which is at the right side of the playbar.
- Open menu : Right click anywhere in the fullscreen mode.
- Close : Double click.
