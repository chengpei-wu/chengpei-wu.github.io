---
layout: blog_post
title: Proofs of Analysis I
date: 2025-07-24
tag: [real analysis, mathematics]
author: Chengpei Wu
---

## Section 2.2

### Lemma 2.2.2

**For any natural number $$n$$, $$n+0=n$$.**

**Proof.** We prove the statement by induction on $$n$$. 

Base Case ($$n=0$$): 

$$
\begin{aligned}
n+0 &= 0+0\\
(\text{definition})&=0\\
&=n
\end{aligned}
$$

Inductive Hypothesis: Assume that for natrual number $$n$$, $$n+0=n$$ is true.

Inductive Step: we show that $$(n++)+0 = n++$$ is true, under the assumption that the inductive hypothesis is true.  

$$
\begin{aligned}
(n++)+0 &= (n+0)++\\
(\text{inductive hypothesis})&=n++ \\
\end{aligned}
$$

Q.E.D.

### Lemma 2.2.3

**$$\forall n, m \in \mathcal{N}, n + (m++) = (n+m)++$$**

**Proof.** We prove the statement by induction on $$n$$. 

Base Case ($$n=0$$):

$$
\begin{aligned}
n + (m++) &= 0 + (m++)\\
(\text{definition}) &= m++\\
(\text{definition})&= (0 + m)++\\
(n=0)&= (n + m)++\\
\end{aligned}
$$

Inductive Hypothesis: Assume that for natrual number $$n$$, $$n + (m++) = (n+m)++$$ is true.

Inductive Step: we show that $$(n++)+(m++) = ((n++)+m)++$$ is true, under the assumption that the inductive hypothesis is true.

$$
\begin{aligned}
(n++) + (m++) &= (n + (m++))++\\
(\text{inductive hypothesis}) &= ((n+m)++)++\\
(\text{definition})&= ((n++)+m)++\\
\end{aligned}
$$

Q.E.D.