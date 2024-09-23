package tools

import (
	"log"
	"net/http"
)

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		wrappedWriter := &StatusRecorder{ResponseWriter: w, StatusCode: http.StatusOK}
		next.ServeHTTP(wrappedWriter, r)
		log.Printf(
			"%s %s %s %d",
			r.Method,
			r.RequestURI,
			r.Proto,
			wrappedWriter.StatusCode,
		)
	})
}

type StatusRecorder struct {
	http.ResponseWriter
	StatusCode int
}

func (r *StatusRecorder) WriteHeader(code int) {
	r.StatusCode = code
	r.ResponseWriter.WriteHeader(code)
}