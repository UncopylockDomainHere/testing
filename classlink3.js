// Create base styles
nconst style = document.createElement("style");
style.textContent = `
    body {
        margin: 0;
        background: #0f172a;
        font-family: Arial, sans-serif;
        overflow: hidden;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, 10%);
        gap: 8%;
        padding: 20px;
        justify-content: start; /* LEFT aligned like Android */
        align-content: start;
    }

    .app-container {
        text-align: center;
        width: 80px;
    }

    .app-btn {
        width: 80px;
        height: 80px;
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
        font-size: 12px;
        color: #94a3b8;
        word-wrap: break-word;
    }
`;
document.head.appendChild(style);

// Create grid container
const grid = document.createElement("div");
grid.className = "grid";
document.body.appendChild(grid);

// App list
const apps = [
    {
        name: "NZ:P",
        url: "https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/test.html",
        icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNIW09jfdkiAfWAQ81HXZaDwktgfgywV4p5w&s"
    },
    {
        name: "Serious Sam",
        url: "https://cdn.jsdelivr.net/gh/prokid8467-collab/serious/local/index.html",
        icon: "https://i.ebayimg.com/00/s/MTI1MFgxMjAw/z/KCwAAOSwYwJlINmB/$_57.JPG?set_id=880000500F"
    },
    {
        name: "Drift Hunters",
        url: "https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/drifthunters.html",
        icon: "https://drifthunters3d.io/assets/upload/poki/webp/drift-hunters.webp"
    },
    {
        name: "Eaglercraft",
        url: "https://cdn.jsdelivr.net/gh/v10letfur/Eaglercraft-X-1.8.8/EaglercraftX_1.8_u53_Offline_Signed.html",
        icon: "https://cdn2.steamgriddb.com/icon_thumb/349319c989f70ac97c3824689547bf5d.png"
    },
    {
        name: "Drivemad",
        url: "https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/drivemad.html",
        icon: "https://cdn-1.webcatalog.io/catalog/poki-drive-mad/poki-drive-mad-icon-filled-256.png?v=1714778298617"
    },
    {
        name: "Snowrider 3D",
        url: "https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/snowrider.html",
        icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJy4pM2G_0ViLxs6g-mq68YS7RRUv_XUHg4w&s"
    },
    {
        name: "Slope",
        url: "https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/slope.html",
        icon: "https://slope-play.com/cache/data/image/game/slope-logo-1-f309x309.webp"
    },
    {
        name: "Subway Surfers",
        url: "https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/subwaysurfers.html",
        icon: "https://static.wikia.nocookie.net/subwaysurf/images/c/c3/ThirtySixthAvatar.jpg/revision/latest/scale-to-width-down/250?cb=20180320175404"
    },
    {
        name: "Buckshot Roulette",
        url: "https://cdn.jsdelivr.net/gh/genizy/web-port@main/buckshot-roulette/index.html",
        icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW0pkA7JfrcIexKwRvSuX4EaJw4n2Gf4r2Sw&s"
    },
    {
        name: "Binding Of Isaac",
        url: "https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/bindingofisaac.html",
        icon: "https://img.tapimg.net/market/images/877d89aad26d46c1ae9934370fc6c22e.jpg"
    },
    {
        name: "Ultra Kill",
        url: "https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/ultrakill.html",
        icon: "https://cdn2.steamgriddb.com/icon_thumb/ba9353718aa3b1793b8a23d51e19ef15.png"
    },
    {
        name: "Pizza Tower",
        url: "https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/pizzatower.html",
        icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS27aoYD-jiZcXXqXMiJ-VtOCA2LvvFHUQu3g&s"
    },
    {
        name: "R.E.P.O",
        url: "https://cdn.jsdelivr.net/gh/UncopylockDomainHere/testing/games/repo.html",
        icon: "https://mir-s3-cdn-cf.behance.net/projects/404/cf0349247119641.Y3JvcCw4NjIsNjc1LDE2OCww.jpg"
    }
];

// Create buttons
apps.forEach(app => {
    const container = document.createElement("div");
    container.className = "app-container";

    const btn = document.createElement("button");
    btn.className = "app-btn";
    btn.innerHTML = "";

const img = document.createElement("img");
img.src = app.icon;
img.style.width = "100%";
img.style.height = "100%";
img.style.objectFit = "cover"; // fills whole button
img.style.borderRadius = "20px"; // match button
img.style.pointerEvents = "none";

btn.appendChild(img);

    btn.onclick = async () => {
    const newWin = window.open("about:blank", "_blank");

    // Show temporary loading screen
    newWin.document.write(`
        <html>
        <body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#0f172a;color:white;font-family:sans-serif;">
            <h2>Loading ${app.name}...</h2>
        </body>
        </html>
    `);
    newWin.document.close();

    try {
        // Fetch the actual HTML from CDN
        const res = await fetch(app.url);
        const html = await res.text();

        // Replace about:blank content with fetched HTML
        newWin.document.open();
        newWin.document.write(html);
        newWin.document.close();

    } catch (err) {
        newWin.document.body.innerHTML = "<h2>Failed to load.</h2>";
    }
};

    const label = document.createElement("div");
    label.className = "label";
    label.innerText = app.name;

    container.appendChild(btn);
    container.appendChild(label);
    grid.appendChild(container);
});
