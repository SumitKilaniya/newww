const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newsText.trim()) return;

  setIsAnalyzing(true);
  setResult(null);

  try {
    const response = await fetch('http://127.0.0.1:5000/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newsText }),
    });

    const data = await response.json();
    setResult(data);
  } catch (error) {
    console.error('Error analyzing text:', error);
  } finally {
    setIsAnalyzing(false);
  }
};
