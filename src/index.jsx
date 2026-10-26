import "./ssr-polyfill.js";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Client-side render — skipped when the module is imported during prerendering
if (typeof window !== "undefined") {
	const root = ReactDOM.createRoot(document.getElementById("root"));
	root.render(
		<HelmetProvider>
			<Router>
				<App />
			</Router>
		</HelmetProvider>
	);
}

// SSR prerender export — called by vite-prerender-plugin at build time
export async function prerender({ url }) {
	const { renderToString } = await import("react-dom/server");
	const { StaticRouter } = await import("react-router-dom/server");

	const helmetContext = {};
	const html = renderToString(
		<HelmetProvider context={helmetContext}>
			<StaticRouter location={url}>
				<App />
			</StaticRouter>
		</HelmetProvider>
	);

	const { helmet } = helmetContext;

	// react-helmet-async returns a complete <title data-rh="true">...</title>
	// tag, while the plugin expects bare text and escapes whatever it is given.
	// Strip the tag (attributes included) and decode the entities helmet added,
	// or the markup itself ends up double-escaped inside <title>.
	const titleText = (tag) =>
		tag
			.replace(/<title[^>]*>/i, "")
			.replace(/<\/title>/i, "")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&amp;/g, "&")
			.trim();
	const headElements = new Set();
	if (helmet) {
		if (helmet.meta.toString()) headElements.add(helmet.meta.toString());
		if (helmet.link.toString()) headElements.add(helmet.link.toString());
		// The JSON-LD LocalBusiness block is a <script> tag. Without this it
		// only exists after hydration, so anything reading the served HTML —
		// social previews, crawlers that do not run JS — never sees it.
		if (helmet.script.toString()) headElements.add(helmet.script.toString());
	}

	return {
		html,
		head: helmet
			? {
					title: titleText(helmet.title.toString()),
					elements: headElements,
			  }
			: undefined,
	};
}
