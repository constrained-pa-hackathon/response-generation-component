;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;                                                                 ;;
;; Custom definition required for our personal assitant project    ;;
;; Required because domain specific requirment.                    ;;
;;                                                                 ;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(set! previous_token_to_words token_to_words)

(define (token_to_words token name)
"In case of a real number, will pronounce the digits one by one excluding the decimal point"
   (cond 
     (
       (string-matches name "[0-9]+\\.[0-9]+" )
       (mapcar num-to-literal (filter is_digit (symbolexplode name))) ; ;; (utf8explode utf8string) ?
     ) 
     (
       t 
       (previous_token_to_words token name)
     )
   )
)

(define (num-to-literal num)
"Returns the literal word of numeric characters"
(car
(cdr 
  (assoc (parse-number num)
   '((1 one) (2 two) (3 three) (4 four) (5 five) (6 six) (7 seven) (8 eight) (9 nine) (0 zero)))))
)

(define (filter pred lst)
"A new list is returned containing only the item matching the predicate"
  (reverse (filter-help pred lst '())))

(define (filter-help pred lst res)
  (cond ((null? lst) res)
        ((pred (car lst)) 
           (filter-help pred (cdr lst)  (cons (car lst) res)))
        (t 
           (filter-help pred (cdr lst)  res))))


(define (is_digit input)
"Is input a single digit number?"
   (string-matches input "[0-9]")
)

