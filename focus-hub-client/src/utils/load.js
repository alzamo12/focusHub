const load = async (levelType, setQuestionLevels) => {
    const module = await import(`../../data/${levelType}.json`);
    return setQuestionLevels(module.default)
};

export default load