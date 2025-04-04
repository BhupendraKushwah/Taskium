export const getAuthHeader = () => {
    try {
        const persistantState = JSON.parse(localStorage.getItem('persistantState'));
        let token = persistantState?.authToken
        if (!token) return null;
        return {
            headers: { token }
        }
    }
    catch (error) {
        console.log(error);
    }
}