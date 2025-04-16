import { useEffect, useState } from 'react';

export const PromiseBuilder = ({ promise, builder, loading, error }) => {
  const [data, setData] = useState(null);
  const [loadingState, setLoadingState] = useState(true);
  const [errorState, setErrorState] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoadingState(true);
    promise()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoadingState(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setErrorState(err);
          setLoadingState(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [promise]);

  if (loadingState) return loading ?? <p>Loading...</p>;
  if (errorState) return error ?? <p>Error: {errorState.message}</p>;
  return builder(data);
};
