const axios = require('axios');

const categorizeItems = async (items) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  const itemList = items.map((item, i) => `${i + 1}. ${item.name}`).join('\n');

  const prompt = `You are a receipt categorizer. Categorize each item into exactly one of these categories:
Food, Drinks, Snacks, Household, Personal Care, Electronics, Clothing, Transport, Entertainment, Medicine, Other.

Items:
${itemList}

Respond with ONLY a JSON array of categories in the same order as the items. Example: ["Food", "Drinks", "Snacks"]
No explanation, no markdown, just the JSON array.`;

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
      }
    );

    const text = response.data.content[0].text.trim();
    const categories = JSON.parse(text);

    // Attach category to each item
    return items.map((item, i) => ({
      ...item,
      category: categories[i] || 'Other',
    }));

  } catch (error) {
    console.error('AI categorization failed:', error.message);
    // If AI fails, return items with default category so save still works
    return items.map(item => ({ ...item, category: 'Other' }));
  }
};

module.exports = { categorizeItems };