const extractErrorMessage = (errorData, fallbackMessage) => {
  if (!errorData) {
    return fallbackMessage;
  }

  if (typeof errorData === "string") {
    return errorData;
  }

  if (
    Array.isArray(errorData.errorMessage) &&
    errorData.errorMessage.length > 0
  ) {
    return errorData.errorMessage[0];
  }

  if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
    return errorData.errors[0];
  }

  return errorData.message || fallbackMessage;
};

export const unwrapApiResponse = (
  response,
  fallbackMessage = "Request failed",
) => {
  const data = response?.data ?? response;

  if (
    data &&
    typeof data === "object" &&
    "isSuccess" in data &&
    data.isSuccess === false
  ) {
    throw new Error(extractErrorMessage(data, fallbackMessage));
  }

  return data;
};

export const normalizeApiError = (
  error,
  fallbackMessage = "Request failed",
) => {
  const errorData = error?.response?.data || error;

  return {
    message: extractErrorMessage(errorData, fallbackMessage),
    statusCode: error?.response?.status,
    raw: errorData,
  };
};
