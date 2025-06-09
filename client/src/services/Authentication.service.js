export const getAuthHeader = () => {
    try {
        const persistantState = JSON.parse(localStorage.getItem('persistantState'));
        let token = persistantState?.token;
        if (!token) return null;
        return {
            Authorization :token
        }
    }
    catch (error) {
        throw error;
    }
}