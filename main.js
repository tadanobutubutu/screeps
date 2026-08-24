function useStateLanguage(initialLanguage) {
  const [language, setLanguage] = useState(initialLanguage);

  useEffect(() => {
    // Set language attribute
    document.documentElement.lang = language;
  }, [language]);

  return [language, setLanguage];
}