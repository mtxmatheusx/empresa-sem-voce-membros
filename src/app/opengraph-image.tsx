import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Programa Empresa Sem Você — Em 120 dias, sua empresa funciona sem você na execução.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#FAFAF7",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Glow background */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "70%",
            height: "60%",
            background:
              "radial-gradient(ellipse at center, rgba(184,144,42,0.08), transparent 70%)",
            display: "flex",
          }}
        />

        {/* Header — Logo "M" + brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontFamily: "serif",
              fontStyle: "italic",
              fontWeight: 900,
              fontSize: 90,
              color: "#B8902A",
              letterSpacing: "-0.06em",
              lineHeight: 0.85,
              display: "flex",
            }}
          >
            M
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              borderLeft: "1px solid #D4CFC0",
              paddingLeft: "20px",
            }}
          >
            <div
              style={{
                fontFamily: "serif",
                fontStyle: "italic",
                fontSize: 22,
                color: "#0F0E0C",
                fontWeight: 400,
                display: "flex",
              }}
            >
              Matheus Martins
            </div>
            <div
              style={{
                fontFamily: "sans-serif",
                fontSize: 13,
                color: "#6B6862",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 500,
                display: "flex",
              }}
            >
              Estrategista do Dono
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 16,
              fontWeight: 500,
              color: "#B8902A",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              marginBottom: "28px",
              display: "flex",
            }}
          >
            Programa Empresa Sem Você
          </div>

          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 78,
              fontWeight: 700,
              color: "#0F0E0C",
              lineHeight: 1.05,
              letterSpacing: "-0.028em",
              marginBottom: "32px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Antes de consertar a empresa,</span>
            <span
              style={{
                fontFamily: "serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#B8902A",
              }}
            >
              calibramos o dono.
            </span>
          </div>

          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 26,
              fontWeight: 300,
              color: "#6B6862",
              lineHeight: 1.45,
              maxWidth: "900px",
              letterSpacing: "-0.012em",
              display: "flex",
            }}
          >
            Em 120 dias, donos de PME migram do operacional tático ao estratégico.
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #EAE6DC",
            paddingTop: "24px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 14,
              color: "#6B6862",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 500,
              display: "flex",
            }}
          >
            empresa-sem-voce.mtxestrategia.com.br
          </div>
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 14,
              color: "#6B6862",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 500,
              display: "flex",
            }}
          >
            7 anos provando · 1 só método
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
