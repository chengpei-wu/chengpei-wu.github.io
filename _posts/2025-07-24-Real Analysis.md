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
&\overset{(i)}{=} (a+(b+c)) ++ \\
&\overset{(i)}{=} a + ((b+c)++) \\
&\overset{(i)}{=} a + (b + (c++))
\end{aligned}
$$

where in $$(i)$$ we use Lemma 2.2.3 in the textbook, in $$(ii)$$ we use the inductive hypothesis.
Thus, by the principle of induction, we conclude that for any natural numbers $$a,b,c$$, we have $$(a+b)+c = a+(b+c)$$.


Q.E.D.