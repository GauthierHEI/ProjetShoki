package main

import (
	"encoding/json"
	"fmt"
	"github.com/gocolly/colly"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
)

type TripAdvisorInfo struct {
	StatusCode int
	Reviews int
	Average float32
}

func Index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprint(w, "Welcome!\n")
}

func handler(w http.ResponseWriter, r *http.Request){
	w.Header().Set("Access-Control-Allow-Origin", "*")
	URL := r.URL.Query().Get("url")
	if URL == ""{
		log.Println("There is no URL !")
		return
	}
	log.Println("Visiting", URL)

	c := colly.NewCollector()

	var p = TripAdvisorInfo{0,0,0}


	//count of reviews
	c.OnHTML("a[href]", func(e *colly.HTMLElement){
		review := e.Request.AbsoluteURL(e.Attr("href"))
		if review != ""{
			p.Reviews++
		}
		p.Average =  float32(p.Reviews) / 100.0
	})

	c.OnResponse(func (r *colly.Response){
		log.Println("response received :", r.StatusCode)
		p.StatusCode = r.StatusCode
	})

	c.OnError(func(r *colly.Response, err error){
	log.Println("error :", r.StatusCode, err)
	p.StatusCode = r.StatusCode
	})

	c.Visit(URL)

	//results in JSON
	b, err := json.Marshal(p)
	if err != nil {
		log.Println("failed to serialize response :", err)
		return
	}
	w.Header().Add("Content-Type", "application/json")
	w.Write(b)
}


func main() {

	router := httprouter.New()

	http.HandleFunc("/", handler)
	log.Fatal(http.ListenAndServe(":8083", router))

}
