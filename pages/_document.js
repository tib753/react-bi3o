import { Children } from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "../src/utils/create-emotion-cache";
import { haveRtlLanguages } from "../src/components/header/top-navbar/language/rtlLanguageList";

class CustomDocument extends Document {
  render() {
    const { initialLang = 'ar', initialDir = 'rtl' } = this.props;

    return (
      <Html lang={initialLang} dir={initialDir}>
        <Head>
          {/* Force RTL as early as possible to avoid flicker */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(){
                  try {
                    var rtlLangs = ["ar", "arc", "dv", "fa", "ha", "he", "khw", "ks", "ku", "ps", "ur", "yl"];
                    var c = document.cookie.split(';').map(function(c){return c.trim().split('=')});
                    var map = {};
                    for (var i=0;i<c.length;i++){ if(c[i][0]) map[c[i][0]] = c[i][1]; }
                    var lang = map['languageSetting'] ? decodeURIComponent(map['languageSetting']).replace(/^"|"$/g,'') : 'ar';
                    var dir = rtlLangs.includes(lang) ? 'rtl' : 'ltr';
                    if (document && document.documentElement) {
                      document.documentElement.setAttribute('dir', dir);
                      document.documentElement.setAttribute('lang', lang || 'ar');
                    }
                  } catch(e) { /* noop */ }
                })();
              `,
            }}
          />

          {/* Social login scripts — loaded on-demand inside GoogleLoginComp/AppleLoginComp */}

          <meta name="theme-color" content="#111827" />

          {/* ✅ Performance — preconnect to external origins */}
          <link rel="preconnect" href="https://bi3o-c3d58.firebaseapp.com" />
          <link rel="preconnect" href="https://dz.bi3o.com" />
          <link rel="preconnect" href="https://apis.google.com" />
          <link rel="preconnect" href="https://maps.googleapis.com" />

          {/* Analytics scripts loaded lazily via AnalyticsScripts component */}


        </Head>

        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    );
  }
}

CustomDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => <App emotionCache={cache} {...props} />,
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  // Determine initial language and direction from cookies (SSR)
  let initialLang = 'ar';
  let initialDir = 'rtl';
  try {
    const rawCookie = ctx.req?.headers?.cookie || '';
    const cookieMap = Object.fromEntries(
      rawCookie.split(';').map((c) => c.trim().split('='))
        .filter(([k]) => k)
    );
    const langCookie = cookieMap['languageSetting'] || null;
    if (langCookie) {
      try {
        // language-setting might be JSON stringified in localStorage, but cookie is plain
        const lang = decodeURIComponent(langCookie).replace(/^"|"$/g, '');
        initialLang = lang || 'ar';
        initialDir = haveRtlLanguages.includes(initialLang) ? 'rtl' : 'ltr';
      } catch {}
    }
  } catch {}

  return {
    ...initialProps,
    initialLang,
    initialDir,
    styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags],
  };
};

export default CustomDocument;
