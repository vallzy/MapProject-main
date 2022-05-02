export function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function(c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const colors = [
  [0.0, 0.0, 0.0, 1.0], // 0 - black		0
  [1.0, 0.0, 0.0, 1.0], // 1 - red			1
  [0.0, 1.0, 0.0, 1.0], // 2 - green		2
  [1.0, 1.0, 0.0, 1.0], // 3 - yellow		3
  [0.0, 0.0, 1.0, 1.0], // 4 - blue			4
  [0.0, 1.0, 1.0, 1.0], // 5 - cyan			5
  [1.0, 0.0, 1.0, 1.0], // 6 - purple		6
  [1.0, 1.0, 1.0, 1.0], // 7 - white		7
  [1.0, 0.5, 0.0, 1.0], // 8 - orange		8
  [0.5, 0.5, 0.5, 1.0], // 9 - md.grey		9
  [0.75, 0.75, 0.75, 1.0], // : - lt.grey		10		// lt grey for names
  [0.75, 0.75, 0.75, 1.0], // ; - lt.grey		11
  [0.0, 0.5, 0.0, 1.0], // < - md.green		12
  [0.5, 0.5, 0.0, 1.0], // = - md.yellow	13
  [0.0, 0.0, 0.5, 1.0], // > - md.blue		14
  [0.5, 0.0, 0.0, 1.0], // ? - md.red		15
  [0.5, 0.25, 0.0, 1.0], // @ - md.orange	16
  [1.0, 0.6, 0.1, 1.0], // A - lt.orange	17
  [0.0, 0.5, 0.5, 1.0], // B - md.cyan		18
  [0.5, 0.0, 0.5, 1.0], // C - md.purple	19
  [0.0, 0.5, 1.0, 1.0], // D				20
  [0.5, 0.0, 1.0, 1.0], // E				21
  [0.2, 0.6, 0.8, 1.0], // F				22
  [0.8, 1.0, 0.8, 1.0], // G				23
  [0.0, 0.4, 0.2, 1.0], // H				24
  [1.0, 0.0, 0.2, 1.0], // I				25
  [0.7, 0.1, 0.1, 1.0], // J				26
  [0.6, 0.2, 0.0, 1.0], // K				27
  [0.8, 0.6, 0.2, 1.0], // L				28
  [0.6, 0.6, 0.2, 1.0], // M				29
  [1.0, 1.0, 0.75, 1.0], // N				30
  [1.0, 1.0, 0.5, 1.0], // O				31
];

function HexCode(rgba) {
  return `#${(
    (1 << 24) +
    ((rgba[0] * 255) << 16) +
    ((rgba[1] * 255) << 8) +
    rgba[2] * 255
  )
    .toString(16)
    .slice(1)}`;
}

function charToColor(code) {
  let ascii = code.charCodeAt(0);
  return HexCode(colors[(ascii - 48) & 31]);
}

export function textToColor(text) {
  if (text === undefined || text === null) {
    text = "";
  }

  if (!text.includes("^")) {
    return `<font class="et-text" color="${charToColor("w")}">${text}</font>`;
  }
  if (text.charAt(0) !== "^") {
    text = "^w" + text;
  }
  let withoutTick = text.split("^").filter((t) => t);
  let returnHtml = "";
  for (let item of withoutTick) {
    if (item.length > 1) {
      let color = item.substring(0, 1);
      let toColor = item.substring(1);
      returnHtml += `<font class="et-text" color="${charToColor(
        color
      )}">${toColor}</font>`;
    }
  }
  return returnHtml;
}
