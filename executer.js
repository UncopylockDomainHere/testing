(function () {
  // COMMANDS
  const commands = {
    run: {
      desc: "Fetches and executes the remote JS file",
      action: async () => {
        input.value = "Loading...";
        try {
          const response = await fetch("https://raw.githubusercontent.com/UncopylockDomainHere/testing/main/classlink.js");
          const scriptText = await response.text();

          if (scriptText.trim().startsWith("<")) {
            throw new Error("Bad URL / not JS");
          }

          const script = document.createElement("script");
          script.textContent = scriptText;
          document.body.appendChild(script);

          input.value = "Executed!";
        } catch (err) {
          console.error(err);
          input.value = "Error loading script";
        }
      }
    },
    hide: {
      desc: "Hides the command box",
      action: () => {
        container.style.display = "none";
        helpMenu.style.display = "none";
        visible = false;
      }
    },
    help: {
      desc: "Shows all available commands",
      action: () => {
        renderHelp();
        helpMenu.style.display = "block";
      }
    }
  };

  // UI container
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "20px";
  container.style.left = "50%";
  container.style.transform = "translateX(-50%)";
  container.style.background = "#2f2f2f";
  container.style.padding = "10px 15px";
  container.style.borderRadius = "10px";
  container.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
  container.style.zIndex = "999999";

  // Input
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Type `help` For All Commands";
  input.style.width = "250px";
  input.style.padding = "8px";
  input.style.border = "none";
  input.style.borderRadius = "6px";
  input.style.outline = "none";
  input.style.fontSize = "14px";
  input.style.background = "#444";
  input.style.color = "#fff";

  // Help menu
  const helpMenu = document.createElement("div");
  helpMenu.style.position = "fixed";
  helpMenu.style.top = "70px";
  helpMenu.style.left = "50%";
  helpMenu.style.transform = "translateX(-50%)";
  helpMenu.style.background = "#1e1e1e";
  helpMenu.style.padding = "10px";
  helpMenu.style.borderRadius = "10px";
  helpMenu.style.boxShadow = "0 4px 15px rgba(0,0,0,0.4)";
  helpMenu.style.color = "#ccc";
  helpMenu.style.fontSize = "13px";
  helpMenu.style.display = "none";
  helpMenu.style.minWidth = "260px";
  helpMenu.style.zIndex = "999999";

  document.body.appendChild(container);
  container.appendChild(input);
  document.body.appendChild(helpMenu);

  let visible = true;

  // Render help menu
  function renderHelp() {
    helpMenu.innerHTML = "<b>Commands:</b><br><br>";

    Object.keys(commands)
      .sort()
      .forEach(cmd => {
        const item = document.createElement("div");
        item.innerHTML = `<span style="color:#fff">${cmd}</span> - ${commands[cmd].desc}`;
        item.style.marginBottom = "5px";
        helpMenu.appendChild(item);
      });
  }

  // Clear "Executed!" on typing or click
  function clearStatus() {
    if (input.value === "Executed!" || input.value.startsWith("Error")) {
      input.value = "";
    }
  }

  input.addEventListener("focus", clearStatus);
  input.addEventListener("input", clearStatus);

  // Command handler
  input.addEventListener("keydown", async function (e) {
    if (e.key === "Enter") {
      const value = input.value.trim().toLowerCase();

      if (commands[value]) {
        commands[value].action();
      }
    }
  });

  // Toggle with ` key
  document.addEventListener("keydown", function (e) {
    if (e.key === "`") {
      visible = !visible;

      container.style.display = visible ? "block" : "none";
      helpMenu.style.display = visible ? helpMenu.style.display : "none";

      if (visible) input.focus();
    }
  });
})();