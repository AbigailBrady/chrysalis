export function htmlescape(s) {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g,"&gt;");
}
