const { GoogleGenerativeAI } = require('@google/generative-ai');

const categorizeItems = async (items) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

  const itemList = items.map((item, i) => `${i + 1}. ${item.name}`).join('\n');

  const prompt = `Categorize each item into exactly one of: Food, Drinks, Snacks, Household, Personal Care, Electronics, Clothing, Transport, Entertainment, Medicine, Other.

Items:
${itemList}

Respond with ONLY a JSON array of categories in the same order. Example: ["Food", "Drinks"]
No explanation, no markdown, just the JSON array.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/```json|```/g, '').trim();
    const categories = JSON.parse(text);

    return items.map((item, i) => ({
      ...item,
      category: categories[i] || 'Other',
    }));
  } catch (error) {
    console.error('AI categorization failed:', error.message);
    return items.map(item => ({ ...item, category: 'Other' }));
  }
};

module.exports = { categorizeItems };