(async () => {
	if (location.protocol !== "https:") {
		throw Error("https環境下で使用してください")
	}

	let text = await navigator.clipboard.readText();
	if (!text) {
		throw Error("クリップボードの中身が空か、またはテキストではありません")
	}

	let regexp_quoted = /"(\\.|[^"\\])*"/g;
	let splited_texts = (text.match(regexp_quoted) || [])
		.reduce((acc, e) => acc.replace(e, e.replaceAll("\n", "<br />")), text)
		.split("\r\n")
		.filter(e => e !== '')
		.map(e => e.split("\t"));

	let header_line = splited_texts[0].reduce((acc, e) => acc + " --- |", "|");
	let header = splited_texts[0].reduce((acc, e) => acc + e + " | ", "| ") + "\n" + header_line;
	let table_expression = splited_texts.slice(1)
		.reduce((acc, e) => acc + e.reduce((acc, e2) => acc + e2 + " | ", "| ") + "\n", "");

	await navigator.clipboard.writeText(header + "\n" + table_expression);

	return true;

})().then(_ => {
	alert("マークダウン形式への変換に成功しました");
}).catch(e => {
	if (e.message.includes("Document is not focused.")) {
		alert("エラー発生: Webページにフォーカスした状態で再試行してください");
	} else {
		alert("エラー発生: " + e.message);
	}
});
