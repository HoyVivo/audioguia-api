// /api/generate.js
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Only POST allowed' });
    }
    const { lat, lng, lang = 'es', mode = 'breve' } = req.body || {};

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ error: 'lat and lng numeric required' });
    }

    function simplePlaceNameFromCoords(lat, lng) {
      return `lugar alrededor de lat ${lat.toFixed(4)}, lon ${lng.toFixed(4)}`;
    }

    const placeName = simplePlaceNameFromCoords(lat, lng);

    let text = '';
    if (mode === 'breve') {
      text = `Te encuentras en ${placeName}. Aquí puedes disfrutar de su arquitectura y ambiente local. Esta descripción es generada automáticamente para ofrecerte una guía rápida.`;
    } else if (mode === 'curiosidades') {
      text = `Curiosidades sobre ${placeName}: Este lugar tiene historia, obras y detalles que merecen la pena observar de cerca. (Texto generado automáticamente).`;
    } else {
      text = `Información sobre ${placeName}: (Descripción más larga generada automáticamente). Puedes ampliar este texto en el futuro conectando la API con bases de datos o modelos de IA.`;
    }

    const payload = {
      text,
      sources: ['generated:local-mvp'],
      generated_at: new Date().toISOString(),
      cache_ttl_seconds: 60 * 60 * 24
    };

    return res.status(200).json(payload);
  } catch (err) {
    console.error('Error /api/generate', err);
    return res.status(500).json({ error: 'server_error' });
  }
}
