function handleToggleSidecar(e) {
  localStorage.setItem("sidecarEnabled", e.target.checked);
  if (e.target.checked) {
    let sidecarElem = document.createElement("li");
    sidecarElem.innerHTML = `<li
    id="sidecar-tab"
    class="mt-0.5 cursor-pointer w-full px-6 py-3 flex gap-5 items-center font-bold bg-white"
  >
    <div class="flex items-center w-7">
      <img class="grayscale" src="../images/sidecar.svg" />
    </div>
    <span>Sidecar</span>
  </li>`;

    document
      .getElementById("settings-tab")
      .parentNode.insertBefore(
        sidecarElem,
        document.getElementById("settings-tab")
      );
    document.getElementById("sidecar-tab").onclick = function () {
      handleSidecarTabClick(this);
    };
  } else {
    document.getElementById("sidecar-tab").remove();
  }
}

function validateXML(xmlString) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xmlString, "text/xml");
  if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
    console.log("The XML is not valid");
  } else {
    console.log("The XML is valid");

    var root = xmlDoc.documentElement;

    if (root.nodeName !== "SidecarConfig") {
      return "Invalid xml file format, root element should be SidecarConfig";
    }

    let buttons = root.querySelectorAll("*");
    buttons = Array.from(buttons).filter(function (el) {
      return el.tagName.startsWith("Button_");
    });

    if (buttons.length === 0) {
      return "Invalid xml file format, there should be at least one button";
    }

    const validateNumber = (value) => {
      return !isNaN(value) || /^\+\d+$/.test(value);
    };

    const validateButton = (button) => {
      const name = button.getAttribute("name");
      const extension = button.getAttribute("extension");
      if (!name || typeof name !== "string") {
        return false;
      }
      if (!extension || !validateNumber(extension)) {
        return false;
      }
      let hasValidAction = false;
      for (const child of button.children) {
        switch (child.nodeName) {
          case "DIAL":
            const dialNumber = child.getAttribute("number");
            if (!dialNumber || !validateNumber(dialNumber)) {
              return false;
            }
            hasValidAction = true;
            break;
          case "PAUSE":
            const pauseSeconds = child.getAttribute("seconds");
            if (!pauseSeconds || !validateNumber(pauseSeconds)) {
              return false;
            }
            hasValidAction = true;
            break;
          case "KEYPRESS":
            const keyPressNumber = child.getAttribute("number");
            if (!keyPressNumber || !/^[0-9]$/.test(keyPressNumber)) {
              return false;
            }
            hasValidAction = true;
            break;
          case "HOLD":
            const holdActive = child.getAttribute("active");
            if (!holdActive || !/^[01]$/.test(holdActive)) {
              return false;
            }
            hasValidAction = true;
            break;
          case "SEND_MESSAGE":
            const fromNumber = child.getAttribute("fromNumber");
            const toNumber = child.getAttribute("toNumber");
            const message = child.getAttribute("message");
            if (!fromNumber || !validateNumber(fromNumber)) {
              return false;
            }
            if (!toNumber || !validateNumber(toNumber)) {
              return false;
            }
            if (!message || typeof message !== "string") {
              return false;
            }
            hasValidAction = true;
            break;
          case "MODIFY_STATUS":
            const toggleMode = child.getAttribute("toggleMode");
            const fromStatuses = child.getAttribute("fromStatuses");
            const toStatus = child.getAttribute("toStatus");
            if (!toggleMode || !/^[01]$/.test(toggleMode)) {
              return false;
            }
            if (!fromStatuses || typeof fromStatuses !== "string") {
              return false;
            }
            if (!toStatus || typeof toStatus !== "string") {
              return false;
            }
            hasValidAction = true;
            break;
          case "HANGUP":
            const hangupActive = child.getAttribute("active");
            if (!hangupActive || !/^[01]$/.test(hangupActive)) {
              return false;
            }
            hasValidAction = true;
            break;
        }
      }
      return hasValidAction;
    };

    buttons.forEach((button) => {
      let isValidBtn = validateButton(button);
      console.log(isValidBtn, "isValid");
    });
  }
}
