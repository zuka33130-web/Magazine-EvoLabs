import React from 'react';
import type { WindowsArtKind } from './Tomo02WindowsEditorialArt';

/**
 * EVO LABS · Cinco ilustraciones de referencia para el Atlas Visual de Windows.
 * Original vector artwork; decorative imagery only, never a live measurement.
 * Textual content remains in Tomo02VisualAtlas and is intentionally not duplicated here.
 */
export const Tomo02WindowsAtlasImage: React.FC<{ kind: WindowsArtKind }> = ({ kind }) => {
  const rawId = React.useId();
  const uid = rawId.replace(/:/g, '');
  const tint = kind === 'cpu' ? '#20E8D5' : kind === 'security' ? '#64DFFF' : kind === 'experiment' ? '#F2C94C' : kind === 'tasks' ? '#87CBFF' : '#60CDFF';

  const circuitPaths = [
    'M40 116 H210 L260 166 H335',
    'M55 390 H190 L246 334 H320',
    'M1080 120 H930 L880 170 H795',
    'M1070 386 H930 L875 330 H810',
    'M140 250 H235 L280 205',
    'M980 260 H884 L842 218',
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
      <svg viewBox="0 0 1120 500" preserveAspectRatio="xMidYMid slice" className="block h-full w-full">
        <defs>
          <linearGradient id={uid + '-base'} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#020711" />
            <stop offset="48%" stopColor="#082544" />
            <stop offset="100%" stopColor="#020914" />
          </linearGradient>
          <linearGradient id={uid + '-glass'} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0A67A5" stopOpacity=".8" />
            <stop offset="55%" stopColor="#082947" stopOpacity=".72" />
            <stop offset="100%" stopColor="#03101E" stopOpacity=".95" />
          </linearGradient>
          <linearGradient id={uid + '-edge'} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0078D4" />
            <stop offset="55%" stopColor={tint} />
            <stop offset="100%" stopColor="#D9F8FF" />
          </linearGradient>
          <radialGradient id={uid + '-glow'}>
            <stop offset="0%" stopColor={tint} stopOpacity=".34" />
            <stop offset="100%" stopColor={tint} stopOpacity="0" />
          </radialGradient>
          <pattern id={uid + '-grid'} width="34" height="34" patternUnits="userSpaceOnUse">
            <path d="M34 0 H0 V34" fill="none" stroke="#63CBFF" strokeOpacity=".1" strokeWidth="1" />
            <circle cx="0" cy="0" r="1.5" fill="#8BE3FF" fillOpacity=".28" />
          </pattern>
          <filter id={uid + '-shadow'} x="-35%" y="-35%" width="170%" height="180%">
            <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#000711" floodOpacity=".8" />
          </filter>
          <filter id={uid + '-soft-glow'} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="11" />
          </filter>
        </defs>

        <rect width="1120" height="500" fill={'url(#' + uid + '-base)'} />
        <rect width="1120" height="500" fill={'url(#' + uid + '-grid)'} />
        <ellipse cx="560" cy="240" rx="475" ry="310" fill={'url(#' + uid + '-glow)'} />
        <g fill="none" stroke={tint} strokeOpacity=".38" strokeWidth="2">
          {circuitPaths.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g fill={tint} fillOpacity=".85">
          {[['210','116'],['335','166'],['190','390'],['320','334'],['930','120'],['795','170'],['930','386'],['810','330'],['235','250'],['842','218']].map(([cx,cy],i) =>
            <circle key={i} cx={cx} cy={cy} r="3.5" />
          )}
        </g>

        {kind === 'kernel' && (
          <g filter={'url(#' + uid + '-shadow)'}>
            <ellipse cx="566" cy="284" rx="240" ry="122" fill={tint} fillOpacity=".1" filter={'url(#' + uid + '-soft-glow)'} />
            <path d="M306 162 L553 91 L816 172 L569 248 Z" fill="#0B4975" fillOpacity=".74" stroke={tint} strokeOpacity=".76" strokeWidth="2" />
            <path d="M306 162 L306 222 L569 309 L569 248 Z" fill="#05213B" stroke="#287FAD" strokeWidth="2" />
            <path d="M569 248 L816 172 L816 231 L569 309 Z" fill="#04182B" stroke="#2BA6D2" strokeWidth="2" />
            <path d="M363 166 L557 112 L758 174 L566 232 Z" fill={'url(#' + uid + '-glass)'} stroke="#A2EBFF" strokeOpacity=".8" strokeWidth="2" />
            <path d="M405 166 L558 124 L713 172 L562 218 Z" fill="#0A4A75" stroke={tint} strokeWidth="2" />
            <path d="M456 164 L558 136 L661 167 L560 198 Z" fill="#071725" stroke="#C7F5FF" strokeWidth="1.5" />
            <path d="M306 162 L553 91 L816 172 M363 166 L557 112 L758 174" fill="none" stroke={'url(#' + uid + '-edge)'} strokeWidth="3" />
            <g fill="none" stroke={tint} strokeWidth="2" strokeOpacity=".8">
              {[0,1,2,3,4,5,6,7].map(i => <path key={i} d={'M' + (393 + i*45) + ' 155 l-10 -22'} />)}
              {[0,1,2,3,4,5,6,7].map(i => <path key={'b'+i} d={'M' + (340 + i*28) + ' 235 l0 27 l35 12'} />)}
            </g>
            <g fill="#B8F3FF">
              {[[435,158],[488,143],[537,150],[589,163],[641,171],[559,184]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="4" />)}
            </g>
            <path d="M418 289 H715 L755 311 H455 Z" fill="#03101D" stroke="#2CAEE2" strokeOpacity=".7" />
            <path d="M455 311 L455 345 L716 345 L716 311" fill="#071A2D" stroke="#2CAEE2" strokeOpacity=".65" />
            <g stroke={tint} strokeOpacity=".65" strokeWidth="2">
              {[0,1,2,3,4,5,6,7,8].map(i => <path key={i} d={'M' + (470+i*27) + ' 319 v18'} />)}
            </g>
          </g>
        )}

        {kind === 'tasks' && (
          <g filter={'url(#' + uid + '-shadow)'}>
            <path d="M315 122 L695 88 L842 151 L458 191 Z" fill="#0A4671" fillOpacity=".75" stroke={tint} strokeOpacity=".8" strokeWidth="2" />
            <path d="M315 122 L315 330 L458 395 L458 191 Z" fill="#04192B" stroke="#2D8FBF" strokeWidth="2" />
            <path d="M458 191 L842 151 L842 350 L458 395 Z" fill="#051323" stroke="#2D8FBF" strokeWidth="2" />
            <path d="M353 141 L693 111 L802 157 L459 182 Z" fill={'url(#' + uid + '-glass)'} stroke="#B7EFFF" strokeOpacity=".7" />
            <g transform="translate(466 206)">
              {[0,1,2,3,4].map(i => (
                <g key={i}>
                  <rect x="0" y={i*32} width="330" height="23" rx="4" fill={i === 1 ? '#0C4166' : '#061F37'} stroke={i === 1 ? tint : '#1D5B82'} strokeOpacity=".85" />
                  <circle cx="16" cy={i*32+11.5} r="4" fill={i === 2 ? '#F2C94C' : tint} />
                  <path d={'M31 ' + (i*32+8) + ' h' + (95+(i%3)*31)} stroke="#BDEBFF" strokeWidth="3" strokeOpacity=".75" />
                  <path d={'M31 ' + (i*32+15) + ' h' + (55+(i%2)*28)} stroke="#4F9FC9" strokeWidth="2" strokeOpacity=".7" />
                  <rect x="253" y={i*32+7} width={31+(i%3)*12} height="8" rx="2" fill={tint} fillOpacity=".52" />
                </g>
              ))}
            </g>
            <g fill="none" stroke={tint} strokeWidth="2.5" strokeOpacity=".8">
              <path d="M265 245 H345 L390 218 H452" />
              <path d="M265 282 H347 L400 312 H452" />
              <path d="M842 220 H892 L922 195 H972" />
              <path d="M842 310 H897 L924 335 H980" />
            </g>
            <g fill="#B8F3FF">
              {[['265','245'],['452','218'],['265','282'],['452','312'],['972','195'],['980','335']].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="4" />)}
            </g>
            <path d="M355 354 L459 401 L799 365" fill="none" stroke="#3A9DCA" strokeWidth="2" strokeDasharray="5 7" />
          </g>
        )}

        {kind === 'cpu' && (
          <g filter={'url(#' + uid + '-shadow)'}>
            <ellipse cx="560" cy="256" rx="260" ry="185" fill={tint} fillOpacity=".09" />
            <g stroke={tint} strokeWidth="3" strokeOpacity=".8">
              {[0,1,2,3,4,5,6,7,8,9,10].map(i => <path key={'l'+i} d={'M' + (430+i*25) + ' 142 v-27'} />)}
              {[0,1,2,3,4,5,6,7,8,9,10].map(i => <path key={'r'+i} d={'M' + (430+i*25) + ' 369 v27'} />)}
              {[0,1,2,3,4,5,6,7].map(i => <path key={'a'+i} d={'M390 ' + (180+i*23) + ' h-29'} />)}
              {[0,1,2,3,4,5,6,7].map(i => <path key={'b'+i} d={'M730 ' + (180+i*23) + ' h29'} />)}
            </g>
            <rect x="388" y="143" width="345" height="230" rx="18" fill="#061B2C" stroke="#74EAF4" strokeWidth="3" />
            <rect x="409" y="160" width="304" height="197" rx="12" fill="#0A3859" stroke="#258EC0" strokeWidth="2" />
            <rect x="435" y="185" width="252" height="147" rx="9" fill="#03101F" stroke={tint} strokeWidth="2" />
            <path d="M447 210 H675 M447 231 H675 M447 252 H675 M447 273 H675 M447 294 H675" stroke="#155378" strokeWidth="1" />
            <path d="M456 301 L487 296 L515 280 L541 286 L574 238 L601 257 L632 215 L668 202" fill="none" stroke={tint} strokeWidth="4" />
            <path d="M456 301 L487 296 L515 280 L541 286 L574 238 L601 257 L632 215 L668 202 L668 314 L456 314 Z" fill={tint} fillOpacity=".12" />
            <circle cx="574" cy="238" r="6" fill="#F2C94C" stroke="#FFF2B0" strokeWidth="2" />
            <circle cx="632" cy="215" r="6" fill="#C7F7FF" stroke={tint} strokeWidth="2" />
            <path d="M388 143 L410 160 M733 143 L713 160 M388 373 L409 357 M733 373 L713 357" stroke="#D1FBFF" strokeWidth="3" />
            <g fill={tint} fillOpacity=".8">
              {[[560,116],[560,400],[361,255],[759,255],[440,135],[684,381]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="4" />)}
            </g>
          </g>
        )}

        {kind === 'security' && (
          <g filter={'url(#' + uid + '-shadow)'}>
            <g transform="translate(220 108)">
              <path d="M0 0 H250 Q262 0 262 12 V272 Q262 284 250 284 H0 Z" fill="#061A2D" stroke="#399FCF" strokeWidth="2" />
              <path d="M0 0 H250 Q262 0 262 12 V43 H0 Z" fill="#0B3C60" stroke="#399FCF" strokeWidth="1.5" />
              <g fill="#8DE6FF">
                <circle cx="20" cy="21" r="4" /><circle cx="35" cy="21" r="4" /><circle cx="50" cy="21" r="4" />
              </g>
              {[0,1,2,3,4,5,6].map(i => (
                <g key={i}>
                  <rect x="18" y={62+i*29} width={i===2 ? 218 : 224} height="20" rx="3" fill={i===2 ? '#4A3418' : '#082640'} stroke={i===2 ? '#F2C94C' : '#1B5B83'} strokeOpacity=".85" />
                  <circle cx="31" cy={72+i*29} r="3.5" fill={i===2 ? '#F2C94C' : tint} />
                  <path d={'M44 ' + (69+i*29) + ' h' + (63+(i%3)*23)} stroke="#C8F0FF" strokeWidth="2.5" strokeOpacity=".8" />
                  <path d={'M44 ' + (76+i*29) + ' h' + (31+(i%2)*21)} stroke="#4B95C0" strokeWidth="2" />
                </g>
              ))}
            </g>
            <g transform="translate(575 112)">
              <path d="M120 0 L225 39 L211 163 Q181 224 120 260 Q59 224 29 163 L15 39 Z" fill="#07365A" stroke="#A8EDFF" strokeWidth="3" />
              <path d="M120 22 L203 53 L192 153 Q167 195 120 226 Q73 195 48 153 L37 53 Z" fill="#061827" stroke={tint} strokeWidth="2.5" />
              <path d="M78 126 L109 157 L166 91" fill="none" stroke="#BDFBFF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M78 126 L109 157 L166 91" fill="none" stroke={tint} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <g transform="translate(778 294)">
              <circle cx="0" cy="0" r="58" fill="#06243A" fillOpacity=".92" stroke={tint} strokeWidth="5" />
              <circle cx="0" cy="0" r="43" fill="none" stroke="#A5F0FF" strokeWidth="2" strokeDasharray="4 7" />
              <path d="M42 43 L97 97" stroke="#9BEAFF" strokeWidth="17" strokeLinecap="round" />
              <path d="M42 43 L97 97" stroke="#0A5480" strokeWidth="9" strokeLinecap="round" />
              <circle cx="-12" cy="-9" r="12" fill={tint} fillOpacity=".45" />
            </g>
          </g>
        )}

        {kind === 'experiment' && (
          <g filter={'url(#' + uid + '-shadow)'}>
            <path d="M260 320 L475 195 L705 265 L490 393 Z" fill="#082944" stroke="#50CFF4" strokeWidth="2" />
            <path d="M260 320 L260 357 L490 438 L490 393 Z" fill="#041628" stroke="#2E85B1" strokeWidth="2" />
            <path d="M490 393 L705 265 L705 305 L490 438 Z" fill="#03101E" stroke="#2E85B1" strokeWidth="2" />
            <g>
              {[
                {x:315,y:297,w:74,h:42,c:'#127AB5'},
                {x:402,y:272,w:74,h:42,c:'#0B5A8B'},
                {x:489,y:247,w:74,h:42,c:'#0D6A9F'},
                {x:576,y:272,w:74,h:42,c:'#14476B'},
                {x:359,y:336,w:74,h:42,c:'#0B527E'},
                {x:446,y:311,w:74,h:42,c:'#0F6D9C'},
                {x:533,y:286,w:74,h:42,c:'#0A3C60'},
              ].map((b,i) => (
                <g key={i}>
                  <path d={'M'+b.x+' '+b.y+' l38 -22 l'+b.w+' 12 l-38 24 Z'} fill={tint} fillOpacity=".34" stroke="#B0F0FF" strokeOpacity=".7" />
                  <path d={'M'+b.x+' '+b.y+' v34 l38 21 v-41 Z'} fill={b.c} stroke="#55BDE5" strokeOpacity=".65" />
                  <path d={'M'+(b.x+38)+' '+(b.y+12)+' v41 l'+b.w+' -23 v-34 Z'} fill="#041421" stroke="#2375A0" strokeOpacity=".9" />
                </g>
              ))}
            </g>
            <path d="M270 142 H410 L455 187 H555 M672 116 H780 L820 158 H910 M786 391 H900 L947 345 H1050" fill="none" stroke={tint} strokeWidth="2.5" strokeOpacity=".75" />
            <g fill="#D2F7FF">
              {[[270,142],[455,187],[672,116],[820,158],[947,345]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="4" />)}
            </g>
            <g transform="translate(756 150)">
              <circle cx="0" cy="0" r="64" fill="#06233A" fillOpacity=".8" stroke="#9BEAFF" strokeWidth="4" />
              <circle cx="0" cy="0" r="44" fill="none" stroke={tint} strokeWidth="2" strokeDasharray="5 7" />
              <path d="M45 45 L95 95" stroke="#A4EBFF" strokeWidth="17" strokeLinecap="round" />
              <path d="M45 45 L95 95" stroke="#0B527E" strokeWidth="8" strokeLinecap="round" />
            </g>
          </g>
        )}

        {kind !== 'kernel' && kind !== 'tasks' && kind !== 'cpu' && kind !== 'security' && kind !== 'experiment' && (
          <g filter={'url(#' + uid + '-shadow)'}>
            <rect x="320" y="110" width="480" height="270" rx="22" fill={'url(#' + uid + '-glass)'} stroke={tint} strokeWidth="3" />
            <circle cx="560" cy="245" r="98" fill="#06233B" stroke="#B6F2FF" strokeWidth="3" />
            <circle cx="560" cy="245" r="72" fill="none" stroke={tint} strokeWidth="4" strokeDasharray="8 8" />
            <path d="M515 246 L548 279 L611 207" stroke="#CBF8FF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}

        <path d="M22 22 H110 H1010 H1098 V78 M22 422 V478 H1098 V422" fill="none" stroke={'url(#' + uid + '-edge)'} strokeWidth="2" strokeOpacity=".72" />
        <path d="M40 39 H130 M990 39 H1080" stroke="#E2FAFF" strokeOpacity=".7" strokeWidth="2" />
      </svg>
    </div>
  );
};
