import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { RecommendedCrop } from '../types/crop';
import { getCropSchedule } from '../data/cropMilestones';

export interface GeneratePdfOptions {
  crop: RecommendedCrop;
  cropName: string;
  language: string;
  farmData?: {
    landAcres?: number | null;
    soilType?: string | null;
    waterSource?: string | null;
    waterCapacity?: string | null;
  };
}

const PDF_TRANSLATIONS: Record<string, Record<string, string>> = {
  appName: { hi: 'फसल-दिशा', mr: 'पीक-दिशा', gu: 'પાક-દિશા', raj: 'फसल-दिशा', en: 'Fasal Disha' },
  slipTitle: { hi: 'डिजिटल फसल योजना एवं कृषि सलाहकार रिपोर्ट', mr: 'डिजिटल पीक नियोजन व कृषी सल्लागार अहवाल', gu: 'ડિજિટલ પાક આયોજન અને કૃષિ સલાહકાર રિપોર્ટ', raj: 'डिजिटल फसल योजना एवं कृषि सलाहकार रिपोर्ट', en: 'Digital Crop Action Plan & Advisory Report' },
  dateLabel: { hi: 'दिनांक', mr: 'दिनांक', gu: 'તારીખ', raj: 'दिनांक', en: 'Date' },
  selectedCrop: { hi: 'चयनित फसल', mr: 'निवडलेले पीक', gu: 'પસંદ કરેલ પાક', raj: 'चुणीज्यौड़ी फसल', en: 'Selected Crop' },
  fieldSize: { hi: 'खेत का आकार', mr: 'शेताचा आकार', gu: 'ખેતરનું કદ', raj: 'खेत रो नाप', en: 'Field Size' },
  soilType: { hi: 'मिट्टी का प्रकार', mr: 'मातीचा प्रकार', gu: 'જમીनનો પ્રકાર', raj: 'माटी रो प्रकार', en: 'Soil Type' },
  waterSource: { hi: 'सिंचाई साधन', mr: 'पाण्याचे साधन', gu: 'સિંચાઈ સાધન', raj: 'सिंचाई रो साधन', en: 'Irrigation Source' },
  acre: { hi: 'एकड़', mr: 'एकर', gu: 'એકર', raj: 'एकड़', en: 'Acre' },
  duration: { hi: 'कालावधि', mr: 'कालावधी', gu: 'કાલાવધિ', raj: 'कालावधि', en: 'Duration' },
  days: { hi: 'दिन', mr: 'दिवस', gu: 'દિવસ', raj: 'दिन', en: 'Days' },
  expectedYield: { hi: 'अनुमानित पैदावार', mr: 'अपेक्षित उत्पादन', gu: 'અંદાજિત ઉત્પાદન', raj: 'अनुमानित पैदावार', en: 'Expected Yield' },
  mandiPrice: { hi: 'मंडी भाव अनुमान', mr: 'मंडी भाव अंदाज', gu: 'બજાર ભાવ અંદાજ', raj: 'मंडी भाव अनुमान', en: 'Estimated Mandi Price' },
  totalCost: { hi: 'कुल उत्पादन लागत', mr: 'एकूण उत्पादन खर्च', gu: 'કુલ ઉત્પાદન ખર્ચ', raj: 'कुल उत्पादन लागत', en: 'Total Production Cost' },
  netProfit: { hi: 'अनुमानित शुद्ध लाभ', mr: 'अपेक्षित निव्वळ नफा', gu: 'અંદાજિત ચોખ્ખો નફો', raj: 'अनुमानित शुद्ध लाभ', en: 'Estimated Net Profit' },
  quintal: { hi: 'क्विंटल', mr: 'क्विंटल', gu: 'ક્વિન્ટલ', raj: 'क्विंटल', en: 'qtl' },
  costBreakdownTitle: { hi: 'मदवार लागत विवरण (CACP मानक)', mr: 'बाबनिहाय खर्च तपशील (CACP मानक)', gu: 'વિગતવાર ખર્ચ વિવરણ (CACP ધોરણ)', raj: 'मदवार लागत विवरण (CACP मानक)', en: 'Itemized Cost Breakdown (CACP Standard)' },
  seedCost: { hi: 'बीज', mr: 'बियाणे', gu: 'બીજ', raj: 'बीज', en: 'Seed' },
  fertilizerCost: { hi: 'उर्वरक/खाद', mr: 'खते/पोषण', gu: 'ખાતર', raj: 'खाद', en: 'Fertilizer' },
  pesticideCost: { hi: 'कीटनाशक', mr: 'कीटकनाशक', gu: 'જંતુનાશક', raj: 'दवा', en: 'Pesticide' },
  machineryCost: { hi: 'जुताई/मशीन', mr: 'मशागत/यंत्रे', gu: 'ખેડ/મશીનરી', raj: 'जुताई/मशीन', en: 'Machinery' },
  labourCost: { hi: 'मजदूरी', mr: 'मजुरी', gu: 'મજૂરી', raj: 'मजदूरी', en: 'Labour' },
  irrigationCost: { hi: 'सिंचाई/बिजली', mr: 'पाणी/वीज', gu: 'સિંચાઈ', raj: 'सिंचाई', en: 'Irrigation' },
  planTitle: { hi: '120-दिवसीय चरणबद्ध फसल कार्य-योजना कैलेंडर', mr: '120-दिवसीय टप्प्याटप्प्याने पीक कार्य-योजना वेळापत्रक', gu: '120-દિવસીય તબક્કાવાર પાક કાર્ય-યોજના કેલેન્ડર', raj: '120-दिवसीय चरणबद्ध फसल कार्य-योजना पंचांग', en: '120-Day Step-by-Step Crop Action Plan Calendar' },
  dayAndStage: { hi: 'दिन व चरण', mr: 'दिवस व टप्पा', gu: 'દિવસ અને તબક્કો', raj: 'दिन व चरण', en: 'Day & Stage' },
  actionAndInstructions: { hi: 'अनुशंसित कृषि कार्य एवं वैज्ञानिक निर्देश', mr: 'शिफारस केलेले कृषी कार्य व शास्त्रीय मार्गदर्शन', gu: 'ભલામણ કરેલ કૃષિ કાર્ય અને વૈજ્ઞાનિક સૂચનાઓ', raj: 'अनुशंसित कृषि कार्य व वैज्ञानिक निर्देश', en: 'Recommended Actions & Agronomic Management' },
  helplineText: { hi: 'किसान कॉल सेन्टर: 1800-180-1551 (टोल-फ्री २४x७) | ICAR एवं राज्य कृषि विश्वविद्यालय पैकेज ऑफ प्रैक्टिसेज पर आधारित', mr: 'शेतकरी कॉल सेंटर: 1800-180-1551 (टोल-फ्री २४x७) | ICAR व कृषी विद्यापीठ मार्गदर्शक तत्त्वांवर आधारित', gu: 'કિસાન કૉલ સેન્ટર: 1800-180-1551 (ટોલ-ફ્રી २४x७) | ICAR અને કૃષિ યુનિવર્સિટી માર્ગદર્શિકા પર આધારિત', raj: 'किसान कॉल सेन्टर: 1800-180-1551 (टोल-फ्री २४x७) | ICAR व कृषि विश्वविद्यालय पैकेज पर आधारित', en: 'Kisan Call Centre: 1800-180-1551 (Toll-Free 24x7) | Based on ICAR & State Agricultural Universities Package of Practices' },
};

const SOIL_NAMES: Record<string, Record<string, string>> = {
  BLACK: { hi: 'काली मिट्टी', mr: 'काळी माती', gu: 'કાળી જમીન', raj: 'काली माटी', en: 'Black Clay Soil' },
  RED: { hi: 'लाल मिट्टी', mr: 'तांबडी माती', gu: 'લાલ જમીન', raj: 'राता माटी', en: 'Red Loam Soil' },
  SANDY: { hi: 'बलुई मिट्टी', mr: 'रेतीयुक्त माती', gu: 'રેતાળ જમીન', raj: 'बलुई माटी', en: 'Sandy Soil' },
  CLAY: { hi: 'चिकनी मिट्टी', mr: 'चिकण माती', gu: 'ચીકણી જમીન', raj: 'चिकनी माटी', en: 'Clay Soil' },
  LOAM: { hi: 'दोमट मिट्टी', mr: 'गाळाची माती', gu: 'ગોરાડુ જમીન', raj: 'दोमट माटी', en: 'Alluvial Loam Soil' },
};

const WATER_NAMES: Record<string, Record<string, string>> = {
  CANAL: { hi: 'नहर सिंचाई', mr: 'कालवा पाणी', gu: 'નહેર સિંચાઈ', raj: 'नहर सिंचाई', en: 'Canal Irrigation' },
  BOREWELL: { hi: 'ट्यूबवेल', mr: 'बोअरवेल', gu: 'બોરવેલ', raj: 'बोरवेल', en: 'Borewell' },
  WELL: { hi: 'कुआं', mr: 'विहीर', gu: 'કૂવો', raj: 'कूवो', en: 'Open Well' },
  RAINFED: { hi: 'वर्षा आधारित', mr: 'पावसावर आधारित', gu: 'વરસાદ આધારિત', raj: 'बरसात पै', en: 'Rainfed' },
};

function formatINR(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  return '₹' + Math.round(val).toLocaleString('en-IN');
}

function buildOffscreenHtml(options: GeneratePdfOptions): HTMLElement {
  const { crop, cropName, language, farmData } = options;
  const langKey = language || 'hi';

  const t = (k: string) => PDF_TRANSLATIONS[k]?.[langKey] || PDF_TRANSLATIONS[k]?.['hi'] || k;

  const soilKey = String(farmData?.soilType || 'BLACK').toUpperCase();
  const waterKey = String(farmData?.waterSource || 'WELL').toUpperCase();
  const soilName = SOIL_NAMES[soilKey]?.[langKey] || SOIL_NAMES['BLACK'][langKey];
  const waterName = WATER_NAMES[waterKey]?.[langKey] || WATER_NAMES['WELL'][langKey];

  const scheduleData = getCropSchedule(crop.crop_id || 'SOYBEAN');
  const milestones = scheduleData.milestones || [];

  const todayFormatted = new Date().toLocaleDateString(
    langKey === 'en' ? 'en-IN' : 'hi-IN',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  const container = document.createElement('div');
  container.id = 'dynamic-pdf-export-container';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = "'Noto Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  container.style.color = '#111827';
  container.style.padding = '24px 28px';
  container.style.boxSizing = 'border-box';
  container.style.lineHeight = '1.4';

  const costBreakdown = crop.cost_breakdown || {
    seed_cost: Math.round(crop.total_cost_inr_per_acre * 0.18),
    fertilizer_cost: Math.round(crop.total_cost_inr_per_acre * 0.22),
    pesticide_cost: Math.round(crop.total_cost_inr_per_acre * 0.12),
    machinery_rental_cost: Math.round(crop.total_cost_inr_per_acre * 0.20),
    labour_cost: Math.round(crop.total_cost_inr_per_acre * 0.20),
    irrigation_electricity_cost: Math.round(crop.total_cost_inr_per_acre * 0.08),
  };

  container.innerHTML = `
    <div style="border: 2px solid #0F381E; border-radius: 16px; padding: 20px; background: #ffffff;">
      
      <!-- 1. Header Bar -->
      <div style="border-bottom: 2px solid #0F381E; padding-bottom: 14px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #0F381E; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: bold;">
            🌾
          </div>
          <div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #0F381E; letter-spacing: -0.5px;">
              ${t('appName')}
            </h1>
            <p style="margin: 3px 0 0 0; font-size: 12px; font-weight: 700; color: #4B5563;">
              ${t('slipTitle')}
            </p>
          </div>
        </div>

        <div style="text-align: right; font-size: 12px; background: #F3F4F6; border: 1px solid #E5E7EB; border-radius: 10px; padding: 6px 14px;">
          <span style="font-weight: 800; color: #1F2937; display: block;">${t('dateLabel')}: ${todayFormatted}</span>
          <span style="font-size: 11px; font-weight: 600; color: #4B5563; display: block; margin-top: 2px;">${t('duration')}: ${scheduleData.durationDays} ${t('days')}</span>
        </div>
      </div>

      <!-- 2. Farmer & Land Profile Grid -->
      <div style="background: #F9FAFB; border-radius: 12px; border: 1px solid #D1D5DB; padding: 10px; margin-top: 14px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center;">
        <div style="border-right: 1px solid #E5E7EB; padding-right: 6px;">
          <span style="font-size: 10px; font-weight: 800; color: #6B7280; text-transform: uppercase; display: block;">${t('selectedCrop')}</span>
          <span style="font-size: 15px; font-weight: 900; color: #0F381E; display: block; margin-top: 2px;">${cropName}</span>
        </div>
        <div style="border-right: 1px solid #E5E7EB; padding-right: 6px;">
          <span style="font-size: 10px; font-weight: 800; color: #6B7280; text-transform: uppercase; display: block;">${t('fieldSize')}</span>
          <span style="font-size: 14px; font-weight: 800; color: #111827; display: block; margin-top: 2px;">${farmData?.landAcres || 2.5} ${t('acre')}</span>
        </div>
        <div style="border-right: 1px solid #E5E7EB; padding-right: 6px;">
          <span style="font-size: 10px; font-weight: 800; color: #6B7280; text-transform: uppercase; display: block;">${t('soilType')}</span>
          <span style="font-size: 13px; font-weight: 800; color: #111827; display: block; margin-top: 2px;">${soilName}</span>
        </div>
        <div>
          <span style="font-size: 10px; font-weight: 800; color: #6B7280; text-transform: uppercase; display: block;">${t('waterSource')}</span>
          <span style="font-size: 13px; font-weight: 800; color: #111827; display: block; margin-top: 2px;">${waterName}</span>
        </div>
      </div>

      <!-- 3. Key Economic Scorecards -->
      <div style="border: 1px solid #D1D5DB; border-radius: 12px; overflow: hidden; margin-top: 14px;">
        <div style="background: #0F381E; color: #ffffff; padding: 6px 14px; display: flex; align-items: center; justify-content: space-between; font-weight: 800; font-size: 12px;">
          <span style="font-size: 13px;">${cropName} (${t('duration')}: ${scheduleData.durationDays} ${t('days')})</span>
          <span style="background: rgba(255,255,255,0.2); padding: 2px 10px; border-radius: 20px; font-size: 11px;">ICAR मानकीकृत</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); text-align: center; background: #ffffff; border-top: 1px solid #E5E7EB;">
          <div style="padding: 10px; border-right: 1px solid #E5E7EB;">
            <span style="font-size: 10px; font-weight: 800; color: #6B7280; text-transform: uppercase; display: block;">${t('expectedYield')}</span>
            <span style="font-size: 15px; font-weight: 900; color: #111827; display: block; margin-top: 3px;">
              ${crop.expected_yield_qtl_per_acre} ${t('quintal')}/${t('acre')}
            </span>
          </div>

          <div style="padding: 10px; border-right: 1px solid #E5E7EB;">
            <span style="font-size: 10px; font-weight: 800; color: #6B7280; text-transform: uppercase; display: block;">${t('mandiPrice')}</span>
            <span style="font-size: 15px; font-weight: 900; color: #111827; display: block; margin-top: 3px;">
              ${formatINR(crop.forecasted_mandi_price_inr_per_qtl || 4500)}/${t('quintal')}
            </span>
          </div>

          <div style="padding: 10px; border-right: 1px solid #E5E7EB;">
            <span style="font-size: 10px; font-weight: 800; color: #6B7280; text-transform: uppercase; display: block;">${t('totalCost')}</span>
            <span style="font-size: 15px; font-weight: 900; color: #111827; display: block; margin-top: 3px;">
              ${formatINR(crop.total_cost_inr_per_acre)}/${t('acre')}
            </span>
          </div>

          <div style="padding: 10px; background: rgba(15, 56, 30, 0.05);">
            <span style="font-size: 10px; font-weight: 900; color: #0F381E; text-transform: uppercase; display: block;">${t('netProfit')}</span>
            <span style="font-size: 17px; font-weight: 900; color: #0F381E; display: block; margin-top: 2px;">
              ${formatINR(crop.expected_net_profit_per_acre_inr)}/${t('acre')}
            </span>
          </div>
        </div>
      </div>

      <!-- 4. CACP Itemized Cost Breakdown -->
      <div style="border: 1px solid #D1D5DB; border-radius: 12px; overflow: hidden; margin-top: 14px;">
        <div style="background: #F3F4F6; padding: 6px 12px; font-weight: 800; color: #1F2937; border-bottom: 1px solid #D1D5DB; font-size: 11px;">
          ${t('costBreakdownTitle')} (प्रति ${t('acre')})
        </div>
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); text-align: center; padding: 8px 4px; background: #ffffff; font-size: 11px;">
          <div style="border-right: 1px solid #E5E7EB; padding: 2px 4px;">
            <span style="font-size: 10px; font-weight: 700; color: #6B7280; display: block;">${t('seedCost')}</span>
            <span style="font-weight: 900; color: #111827; display: block; margin-top: 2px;">${formatINR(costBreakdown.seed_cost)}</span>
          </div>
          <div style="border-right: 1px solid #E5E7EB; padding: 2px 4px;">
            <span style="font-size: 10px; font-weight: 700; color: #6B7280; display: block;">${t('fertilizerCost')}</span>
            <span style="font-weight: 900; color: #111827; display: block; margin-top: 2px;">${formatINR(costBreakdown.fertilizer_cost)}</span>
          </div>
          <div style="border-right: 1px solid #E5E7EB; padding: 2px 4px;">
            <span style="font-size: 10px; font-weight: 700; color: #6B7280; display: block;">${t('pesticideCost')}</span>
            <span style="font-weight: 900; color: #111827; display: block; margin-top: 2px;">${formatINR(costBreakdown.pesticide_cost)}</span>
          </div>
          <div style="border-right: 1px solid #E5E7EB; padding: 2px 4px;">
            <span style="font-size: 10px; font-weight: 700; color: #6B7280; display: block;">${t('machineryCost')}</span>
            <span style="font-weight: 900; color: #111827; display: block; margin-top: 2px;">${formatINR(costBreakdown.machinery_rental_cost)}</span>
          </div>
          <div style="border-right: 1px solid #E5E7EB; padding: 2px 4px;">
            <span style="font-size: 10px; font-weight: 700; color: #6B7280; display: block;">${t('labourCost')}</span>
            <span style="font-weight: 900; color: #111827; display: block; margin-top: 2px;">${formatINR(costBreakdown.labour_cost)}</span>
          </div>
          <div style="padding: 2px 4px;">
            <span style="font-size: 10px; font-weight: 700; color: #6B7280; display: block;">${t('irrigationCost')}</span>
            <span style="font-weight: 900; color: #111827; display: block; margin-top: 2px;">${formatINR(costBreakdown.irrigation_electricity_cost)}</span>
          </div>
        </div>
      </div>

      <!-- 5. 120-Day Action Schedule Table -->
      <div style="border: 1px solid #D1D5DB; border-radius: 12px; overflow: hidden; margin-top: 14px;">
        <div style="background: #0F381E; color: #ffffff; padding: 6px 12px; font-weight: 800; display: flex; align-items: center; justify-content: space-between; font-size: 11px;">
          <span style="font-size: 12px; font-weight: 900;">${t('planTitle')}</span>
          <span>${scheduleData.durationDays} ${t('days')}</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 11px;">
          <thead>
            <tr style="background: #F3F4F6; border-bottom: 1px solid #D1D5DB; font-size: 10px; font-weight: 800; color: #4B5563; text-transform: uppercase;">
              <th style="padding: 6px 10px; width: 25%;">${t('dayAndStage')}</th>
              <th style="padding: 6px 10px; width: 75%;">${t('actionAndInstructions')}</th>
            </tr>
          </thead>
          <tbody>
            ${milestones.map((m, idx) => {
              const bg = idx % 2 === 0 ? '#ffffff' : '#F9FAFB';
              const badgeText = (m.badge as any)[langKey] || m.badge.hi || 'चरण';
              const titleText = (m.title as any)[langKey] || m.title.hi || 'कृषि कार्य';
              const descText = (m.desc as any)[langKey] || m.desc.hi || '';

              return `
                <tr style="background: ${bg}; border-bottom: 1px solid #E5E7EB;">
                  <td style="padding: 7px 10px; vertical-align: top; font-weight: 800; color: #111827;">
                    <span style="display: inline-block; background: rgba(15, 56, 30, 0.1); color: #0F381E; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 900; border: 1px solid rgba(15, 56, 30, 0.2); margin-bottom: 3px;">
                      ${t('days')} ${m.day}
                    </span>
                    <span style="display: block; font-size: 11px; font-weight: 800; color: #1F2937; line-height: 1.2;">
                      ${badgeText}
                    </span>
                  </td>
                  <td style="padding: 7px 10px; vertical-align: top;">
                    <span style="font-weight: 900; color: #111827; font-size: 11.5px; display: block; line-height: 1.3;">
                      ${titleText}
                    </span>
                    <p style="margin: 3px 0 0 0; font-size: 10.5px; color: #4B5563; line-height: 1.45;">
                      ${descText}
                    </p>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- 6. Helpline Footer -->
      <div style="margin-top: 14px; padding-top: 8px; border-top: 1px solid #D1D5DB; text-align: center; font-size: 10px; font-weight: 800; color: #0F381E; line-height: 1.4;">
        ${t('helplineText')}
      </div>

    </div>
  `;

  return container;
}

export async function generateAndDownloadCropPdf(options: GeneratePdfOptions): Promise<void> {
  const { crop } = options;
  const filename = `Fasal_Disha_Action_Plan_${crop.crop_id || 'Report'}.pdf`;

  const offscreenElement = buildOffscreenHtml(options);
  document.body.appendChild(offscreenElement);

  try {
    const canvas = await html2canvas(offscreenElement, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const contentWidth = pdfWidth - (margin * 2);
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    if (contentHeight <= pdfHeight - (margin * 2)) {
      pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
    } else {
      let heightLeft = contentHeight;
      let position = margin;

      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight);
      heightLeft -= (pdfHeight - margin);

      while (heightLeft > 0) {
        position = heightLeft - contentHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight);
        heightLeft -= pdfHeight;
      }
    }

    pdf.save(filename);
  } catch (err) {
    console.error('[PDF] Export error:', err);
  } finally {
    if (document.body.contains(offscreenElement)) {
      document.body.removeChild(offscreenElement);
    }
  }
}
