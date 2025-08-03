---
layout: blog_post
title: Exercises of Analysis I
date: 2025-07-24
tag: [real analysis, mathematics]
author: Chengpei Wu
---

## Section 2

### 2.2.1 
**Proposition 2.2.5 (Addition is associative). For any natural numbers $$a,b,c$$, we have $$(a+b)+c = a+(b+c)$$.**

We prove the statement by induction on $$c$$.

Base Case ($$c=0$$):

$$
\begin{aligned}
(a+b)+0 &\overset{(i)}{=} a+b\\
&\overset{(i)}{=} a+(b+0)\\
&= a+(b+c)\\
\end{aligned}
$$

where in $$(i)$$ we use Lemma 2.2.2 in the textbook.


Inductive Hypothesis: Assume that for natural number $$c$$, $$(a+b)+c = a+(b+c)$$ is true.

Inductive Step: we show that $$(a+b)+(c++) = a+(b+(c++))$$ is true, under the assumption that the inductive hypothesis is true.

$$
\begin{aligned}
(a+b)+(c++) &\overset{(i)}{=} ((a+b)+c)++\\
&\overset{(ii)}{=} (a+(b+c)) ++ \\
&\overset{(i)}{=} a + ((b+c)++) \\
&\overset{(i)}{=} a + (b + (c++))
\end{aligned}
$$

where in $$(i)$$ we use Lemma 2.2.3 in the textbook, in $$(ii)$$ we use the inductive hypothesis.
Thus, by the principle of induction, we conclude that for any natural numbers $$a,b,c$$, we have $$(a+b)+c = a+(b+c)$$.


Q.E.D.

### 2.2.2

**Lemma 2.2.10. Let $$a$$ be a positive number. Then there exists exactly one natural number $$b$$ such that $$b++ = a$$.**

We prove the statement by induction on $$a$$.

Base Case ($$a=1$$):

$$
\begin{aligned}
0 ++ &= 1\\
\Rightarrow b &= 0
\end{aligned}
$$

Inductive Hypothesis: Assume that for positive natural number $$a$$, there exists exactly one natural number $$b$$ such that $$b++ = a$$.

Inductive Step: we show that there exists exactly one natural number $$b$$ such that $$b++ = a++$$, under the assumption that the inductive hypothesis is true.

$$
\begin{aligned}
b++ &= a++\\
\overset{(i)}{\Rightarrow} b &= a\\
\end{aligned}
$$

where in $$(i)$$ we use the peano axioms (if $$n++ = m++$$, then we must have $$n = m$$), and $$b = a$$ is a natural number since $$a$$ is a positive natural number.
Thus, by the principle of induction, we conclude that for any positive natural number $$a$$, there exists exactly one natural number $$b$$ such that $$b++ = a$$. 

Q.E.D.

### 2.2.3

**Proposition 2.2.12 (Basic properties of order for natural numbers).**

**Let $$a, b, c$$ be natural numbers. Then:**

**(a) (Order is reflexive) $$a \ge a$$.**

There exists natural number $$0$$ such that $$a = a + 0$$, which implies $$a \ge a$$ by definition. Q.E.D.

(b) (Order is transitive) If $$a \ge b$$ and $$b \ge c$$, then $$a \ge c$$.

(c) (Order is anti-symmetric) If $$a \ge b$$ and $$b \ge a$$, then $$a = b$$.

(d) (Addition preserves order) $$a \ge b$$ if and only if $$a + c \ge b + c$$.

(e) $$a < b$$ if and only if $$a++ \le b$$.

(f ) $$a < b$$ if and only if $$b = a + d$$ for some positive number $$d$$.