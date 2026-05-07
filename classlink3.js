// Create base styles
const style = document.createElement('style');
style.textContent = `
    body {
        margin: 0;
        background: #0f172a;
        font-family: Arial, sans-serif;
        overflow: hidden;
    }
      
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 40px;
        padding: 20px;
        justify-content: center;
        box-sizing: border-box;
        min-height: 100vh;
        overflow-y: auto;
        justify-items: center;
        align-content: start;
    }

    #searchBar {
    position: sticky;
    top: 10px;

    display: block;
    margin: 0 auto;          /* centers it horizontally */

    width: 90%;              /* responsive width */
    max-width: 725px;        /* caps size on big screens */

    padding: 15px 20px;
    font-size: 18px;

    border: none;
    outline: none;
    box-sizing: border-box;

    background: #1e293b;
    color: white;
    z-index: 100;
    border-radius: 20px;
}

#searchBar::placeholder {
    color: #94a3b8;
}

    .app-container {
        text-align: center;
        width: 100%;
        height: 170px; /* lock total height */
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .app-btn {
        width: 125px;
        height: 125px;
        border-radius: 20px;
        border: none;
        background: linear-gradient(145deg, #1e293b, #334155);
        color: white;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 5px 5px 10px #020617,
                    -5px -5px 10px #1e293b;
        transition: all 0.2s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        padding: 0; /* remove spacing */
    }

    .app-btn:hover {
        transform: scale(1.1);
    }

    .app-btn:active {
        transform: scale(0.95);
        box-shadow: inset 3px 3px 6px #020617,
                    inset -3px -3px 6px #1e293b;
    }

    .label {
        margin-top: 6px;
        font-size: 20px;
        color: #94a3b8;
        word-wrap: break-word;
    }
`;
document.head.appendChild(style);

const searchBar = document.createElement('input');
searchBar.id = 'searchBar';
searchBar.placeholder = 'Search games...';
document.body.appendChild(searchBar);

// Create grid container
const grid = document.createElement('div');
grid.className = 'grid';
grid.id = 'appGrid';
document.body.appendChild(grid);

// App list
const apps = [
  {
    name: 'NZ:P',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/test.html',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNIW09jfdkiAfWAQ81HXZaDwktgfgywV4p5w&s',
  },
  {
    name: 'Serious Sam',
    url: 'https://cdn.jsdelivr.net/gh/prokid8467-collab/serious/local/index.html',
    icon: 'https://i.ebayimg.com/00/s/MTI1MFgxMjAw/z/KCwAAOSwYwJlINmB/$_57.JPG?set_id=880000500F',
  },
  {
    name: 'Drift Hunters',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/drifthunters.html',
    icon: 'https://drifthunters3d.io/assets/upload/poki/webp/drift-hunters.webp',
  },
  {
    name: 'Eaglercraft',
    url: 'https://cdn.jsdelivr.net/gh/v10letfur/Eaglercraft-X-1.8.8/EaglercraftX_1.8_u53_Offline_Signed.html',
    icon: 'https://cdn2.steamgriddb.com/icon_thumb/349319c989f70ac97c3824689547bf5d.png',
  },
  {
    name: 'Drivemad',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/drivemad.html',
    icon: 'https://cdn-1.webcatalog.io/catalog/poki-drive-mad/poki-drive-mad-icon-filled-256.png?v=1714778298617',
  },
  {
    name: 'Snowrider 3D',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/snowrider.html',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJy4pM2G_0ViLxs6g-mq68YS7RRUv_XUHg4w&s',
  },
  {
    name: 'Slope',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/slope.html',
    icon: 'https://slope-play.com/cache/data/image/game/slope-logo-1-f309x309.webp',
  },
  {
    name: 'Subway Surfers',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/subwaysurfers.html',
    icon: 'https://static.wikia.nocookie.net/subwaysurf/images/c/c3/ThirtySixthAvatar.jpg',
  },
  {
    name: 'Buckshot Roulette',
    url: 'https://cdn.jsdelivr.net/gh/genizy/web-port@main/buckshot-roulette/index.html',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW0pkA7JfrcIexKwRvSuX4EaJw4n2Gf4r2Sw&s',
  },
  {
    name: 'Binding Of Isaac',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/bindingofisaac.html',
    icon: 'https://img.tapimg.net/market/images/877d89aad26d46c1ae9934370fc6c22e.jpg',
  },
  {
    name: 'Ultra Kill',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/ultrakill.html',
    icon: 'https://cdn2.steamgriddb.com/icon_thumb/ba9353718aa3b1793b8a23d51e19ef15.png',
  },
  {
    name: 'Pizza Tower',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/pizzatower.html',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS27aoYD-jiZcXXqXMiJ-VtOCA2LvvFHUQu3g&s',
  },
  {
    name: 'R.E.P.O',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/repo.html',
    icon: 'https://mir-s3-cdn-cf.behance.net/projects/404/cf0349247119641.Y3JvcCw4NjIsNjc1LDE2OCww.jpg',
  },
  {
    name: 'Gun Spin',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/gunspin.html',
    icon: 'https://sc.filehippo.net/images/t_app-icon-l/p/39d0a468-21ab-466d-a65b-5585c02dd7ad/15864794/gunspin-logo',
  },
  {
    name: 'Cookie Clicker',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/cookieclicker.html',
    icon: 'https://play-lh.googleusercontent.com/Z1MOuuiD05ZN5LkVmMEvKF0mqAc-FknaQ2j8s4dZiO-LSPQX4EEA3RVJdlQEtxe96ok',
  },
  {
    name: 'Tiny Fishing',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/tinyfishing.html',
    icon: 'https://lh3.googleusercontent.com/hca11Z4buNnAB96QUDvbm107tF0r5EHZXQ5IwTjjbim83MALr6YfxR6HGafEytvBEkeRPiBsnPhOduvQRdYBjOheOw=s128-rj-sc0x00ffffff',
  },
  {
    name: 'Paper io',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/paper/index.html',
    icon: 'https://i.pinimg.com/736x/33/48/8a/33488a03a8ec1fb8f79d4800e5d17dcf.jpg',
  },
  {
    name: 'Baldis-plus',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/baldi.html',
    icon: 'https://play-lh.googleusercontent.com/EPV1TB4So1lB0DGrdCVExDpNU8ML67nd8OqBeoOIM-s6sDicxmDdPvCXD6n7LKevFl0',
  },
  {
    name: 'Getting Over It',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/getting-over-it.html',
    icon: 'https://play-lh.googleusercontent.com/xEDOZ9oZZrHswGxUR3w55e4XL9nF2r9HQpmpBO2iGsX3EbCstxawIpZB-EykrCPl6c0',
  },
  {
    name: 'Dumb Ways To Die',
    url: 'https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/dumb-ways-to-die.html',
    icon: 'https://yt3.googleusercontent.com/ytc/AIdro_lS_HLx-8hMfveILM_CAmaWxgaOCwBKxb10vi55pPkCteU=s900-c-k-c0x00ffffff-no-rj',
  },
];

// Create buttons
const grid2 = document.getElementById('appGrid');

function renderApps(filteredApps) {
  grid2.innerHTML = '';

  filteredApps.forEach((app) => {
    const container = document.createElement('div');
    container.className = 'app-container';

    const btn = document.createElement('button');
    btn.className = 'app-btn';

    const img = document.createElement('img');
    img.src = app.icon;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '20px';
    img.style.pointerEvents = 'none';

    btn.appendChild(img);

    btn.onclick = async () => {
      const newWin = window.open('about:blank', '_blank');

      newWin.document.write(`
                <html>
                <body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#0f172a;color:white;font-family:sans-serif;">
                    <h2>Loading ${app.name}...</h2>
                </body>
                </html>
            `);
      newWin.document.close();

      try {
        const res = await fetch(app.url);
        const html = await res.text();

        newWin.document.open();
        newWin.document.write(html);
        newWin.document.close();
      } catch (err) {
        newWin.document.body.innerHTML = '<h2>Failed to load.</h2>';
      }
    };

    const label = document.createElement('div');
    label.className = 'label';
    label.innerText = app.name;

    container.appendChild(btn);
    container.appendChild(label);
    grid2.appendChild(container);
  });
}

renderApps(apps);

document.getElementById('searchBar').addEventListener('input', function () {
  const searchText = this.value.toLowerCase();

  const filtered = apps.filter((app) =>
    app.name.toLowerCase().includes(searchText),
  );

  renderApps(filtered);
});
