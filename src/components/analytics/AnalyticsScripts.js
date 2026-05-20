"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

const ANALYTICS_CACHE_KEY = "__analytics_config"
const ANALYTICS_CACHE_TTL = 10 * 60 * 1000

export default function AnalyticsScripts() {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    let cancelled = false

    const cached = sessionStorage.getItem(ANALYTICS_CACHE_KEY)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (parsed._ts && Date.now() - parsed._ts < ANALYTICS_CACHE_TTL) {
          setConfig(parsed)
          return
        }
      } catch {}
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com"
    fetch(`${baseUrl}/api/v1/config/get-analytic-scripts`, {
      headers: {
        "X-software-id": "33571750",
        "X-server": "server",
        origin: process.env.NEXT_CLIENT_HOST_URL || "http://localhost:3000",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const cfg = {}
        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item.type && item.script_id) cfg[item.type] = item.script_id
          })
        }
        cfg._ts = Date.now()
        try { sessionStorage.setItem(ANALYTICS_CACHE_KEY, JSON.stringify(cfg)) } catch {}
        if (!cancelled) setConfig(cfg)
      })
      .catch(() => {})
  }, [])

  if (!config) return null

  return (
    <>
      {config.google_tag_manager && (
        <Script
          id="gtm"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${config.google_tag_manager}');
            `,
          }}
        />
      )}

      {config.google_analytics && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${config.google_analytics}`}
            strategy="lazyOnload"
          />
          <Script
            id="ga"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config','${config.google_analytics}');
              `,
            }}
          />
        </>
      )}

      {config.facebook_pixel && (
        <Script
          id="fb-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f.fbq)f.fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init','${config.facebook_pixel}');
              fbq('track','PageView');
            `,
          }}
        />
      )}

      {config.linkedin_insight_tag && (
        <Script
          id="linkedin"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              _linkedin_partner_id = "${config.linkedin_insight_tag}";
              window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
              window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            `,
          }}
        />
      )}

      {config.tiktok_pixel && (
        <Script
          id="tiktok"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function (w,d,t) {
                w[t] = w[t] || [];
                w[t].push({'ttq.load': '${config.tiktok_pixel}','ttq.track': 'PageView'});
                var s = d.createElement('script');
                s.src = 'https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=${config.tiktok_pixel}';
                s.async = true;
                var e = d.getElementsByTagName('script')[0];
                e.parentNode.insertBefore(s,e);
              }(window, document, 'ttq');
            `,
          }}
        />
      )}

      {config.snapchat_pixel && (
        <Script
          id="snapchat"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(e,t,n,c,r,a,i){e.tta=n,e.ttaQueue=e.ttaQueue||[],
              e.ttaConfig={pixelId:"${config.snapchat_pixel}",events:"page_view"},
              e.ttaQueue.push({event:"page_view",parameters:{}});
              var s=t.createElement(n);s.async=!0;s.src="https://tr.snapchat.com/tr.js";
              var o=t.getElementsByTagName(n)[0];o.parentNode.insertBefore(s,o)})
              (window,document,"script");
            `,
          }}
        />
      )}

      {config.x_pixel && (
        <Script
          id="twitter-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
              },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
              a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
              twq('config','${config.x_pixel}');
              twq('track','PageView');
            `,
          }}
        />
      )}

      {config.pinterest_pixel && (
        <Script
          id="pinterest"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              !function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(
              Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");
              t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
              pintrk('load', '${config.pinterest_pixel}');
              pintrk('page');
            `,
          }}
        />
      )}
    </>
  )
}
