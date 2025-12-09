---
layout: blog_post
title: Hoeffding's Inequality And Its Proof
date: 2025-08-11
tag: [mathematics, statistics]
author: Chengpei Wu
excerpt: This post provides an overview of Hoeffding's Inequality and its proof.
---

## 1. Overview of Heoffding Inequality

The Hoeffding Inequality is a fundamental result in probability theory that **provides a bound on the sum (or average) of bounded independent random variables.** It is particularly useful in the fields of statistics and machine learning.

## 2. Statement of Hoeffding's Inequality
**Hoeffding's Inequality**: Let $X_1, X_2, \ldots, X_n$ be independent random variables such that for each $i$, $X_i$ takes values in the interval $[a_i, b_i]$. Define the sample sum as:
$S_n = \sum_{i=1}^{n} X_i$, and sample mean as: $\bar{X} = \frac{1}{n} S_n$.
Then, for any $\epsilon > 0$, the following inequality holds for $S_n$:

$$
P\left( \left| S_n - \mathbb{E}[S_n] \right| \geq \epsilon \right) \leq 2 \exp\left( -\frac{2 \epsilon^2}{\sum_{i=1}^{n}(b_i - a_i)^2} \right)
$$

and the following inequality holds for $\bar{X}$:

$$
P\left( \left| \bar{X} - \mu \right| \geq \epsilon \right) \leq 2 \exp\left( -\frac{2n^2 \epsilon^2}{\sum_{i=1}^{n}(b_i - a_i)^2} \right)
$$

where $\mu = \mathbb{E}[X_i]$ is the expected value of the random variables.

## 3. Proof

The proof of Hoeffding's inequality makes use of **Markov's inequality** and **Hoeffding lemma**.

### 3.1. Markov's inequality
**Markov's Inequality:** Let $X$ be a non-negative random variable and $t > 0$. Then,

$$
P(X \ge t\mathbb{E}[X]) \le \frac{1}{t},
$$

**Proof:**

$$
\begin{aligned}
P(X \ge t\mathbb{E}[X]) &= \int_{x>t\mathbb{E}[X]} p(x) dx \\
&\le \int_{x>\mathbb{E}[X]} p(x) \cdot \frac{x}{t\mathbb{E}[X]} dx \\
&\le \int_x p(x) \cdot \frac{x}{t\mathbb{E}[X]} dx \\
&= \mathbb{E}[\frac{x}{t\mathbb{E}[X]}] \\
&= \frac{1}{t}.

\end{aligned}
$$

Q.E.D.

**Corollary 1**: Let $X$ be a non-negative random variable and $\epsilon = t\mathbb{E}[X] > 0$. Then,

$$
P(X \ge \epsilon) \le \epsilon^{-1} \mathbb{E}[X].
$$

**Corollary 2**: Let $X$ be a random variable, $t>0$, and $\epsilon > 0$, then we have:

$$
\begin{aligned}
P(X \ge \epsilon) &= P\left ( e^{tX} \ge e^{t\epsilon} \right) \\
&(\text{Let }Y = e^{tX} > 0) \\
&= P\left ( Y \ge e^{t\epsilon} \right) \\
&(\text{Let }e^{t\epsilon} = \mu > 0) \\
&= P\left ( Y \ge \mu \right) \\
&\le \mu^{-1} \mathbb{E}[Y] \\
&= e^{-t\epsilon} \mathbb{E}[e^{tX}].
\end{aligned}
$$

### 3.2. Heoffding lemma

**Heoffding Lemma**: Let $X$ be a bounded random variable with $\mathbb{E}[X] = 0$ and $a \leq X \leq b$, $a < b$.
Then, for any $t > 0$, the following inequality holds:

$$
\mathbb{E}[e^{tX}] \leq e^{\frac{t^2(b - a)^2}{8}}.
$$

**Proof**:

$$
\begin{aligned}
\mathbb{E}[e^{tX}] 
&\le \mathbb{E}[\frac{b-X}{b-a}e^{ta} + \frac{X-a}{b-a}e^{tb}] && \text{(by Jensen's inequality)} \\
&= \mathbb{E}[\frac{b-X}{b-a}e^{ta}] + \mathbb{E}[\frac{X-a}{b-a}e^{tb}] && \text{} \\ 
&= \frac{b}{b-a}e^{ta} + \frac{-a}{b-a}e^{tb} && \text{(by linearity of expectation)} \\
&= \exp \left( \log \left( \frac{b}{b-a}e^{ta} + \frac{-a}{b-a}e^{tb} \right) \right) && \text{} \\
& = e^{\phi(t)} && \text{let} \log \left( \frac{b}{b-a}e^{ta} + \frac{-a}{b-a}e^{tb} \right) = \phi(t),
\end{aligned}
$$

Therefore, we have:

$$
\mathbb{E}[e^{tX}] \le e^{\phi(t)},
$$

where we can bound $e^{\phi(t)}$ by bound $\phi(t)$:

(1) For $\phi(t)$ we have:

$$
\begin{aligned}
\phi(t) 
&= \log \left( \frac{b}{b-a}e^{ta} + \frac{-a}{b-a}e^{tb} \right)  \\
&= \log \left( e^{ta} \cdot \left( \frac{b}{b-a} + \frac{-a}{b-a}e^{t(b-a)} \right) \right) \\
&= ta + \log \left( \left( \frac{b}{b-a} + \frac{-a}{b-a}e^{t(b-a)} \right) \right) && ({\color{red} \phi(0) = 0})
\end{aligned}
$$

(2) For $\phi'(t)$, we have:

$$
\begin{aligned}
\phi'(t) 
&= a + \frac{-a\cdot e^{t(b-a)}}{\frac{b}{b-a} + \frac{-a}{b-a}e^{t(b-a)}} \\
& = a - \frac{a}{\frac{b}{b-a}e^{t(b-a)} - \frac{a}{b-a}} && && ({\color{red} \phi'(0) = 0})
\end{aligned}
$$

(3) For $\phi''(t)$, we have:

$$
\begin{aligned}
\phi''(t) 
&= \frac{-ab\cdot e^{-t(b-a)}}{\left(\frac{b}{b-a}\cdot e^{-t(b-a)} + \frac{-a}{b-a}\right)^2} \\
&= \frac{\frac{b}{b-a}\cdot \frac{-a}{b-a} \cdot e^{-t(b-a)}}{\left(\frac{b}{b-a}\cdot e^{-t(b-a)} + \frac{-a}{b-a}\right)^2} \cdot (b-a)^2\\
&= \frac{m\cdot n}{(m+n)^2} * (b-a)^2 && (m = \frac{b}{b-a}\cdot e^{-t(b-a)}, n = \frac{-a}{b-a})\\
&\le \frac{1}{4} (b-a)^2 && ((m+n)^2 \ge 4mn)
\end{aligned}
$$

Therefore, we have:

$$
\phi(t) = \phi(0) + t\phi'(0) + \frac{t^2}{2}\phi''(\theta) \le t^2\frac{(b-a)^2}{8},
$$

where $\theta \in [0,t]$.

Thus, we have:

$$
\mathbb{E}[e^{tX}] \le e^{\phi(t)} \le e^{t^2\frac{(b-a)^2}{8}}. 
$$

Q.E.D.

### 3.3. Hoeffding's inequality

Using the Markov's inequality and the Hoeffding lemma, we can rewrite:

$$
\begin{aligned}
P\left( S_m - \mathbb{E}[S_m] \geq \epsilon \right)
&\le e^{-t\epsilon} \mathbb{E}[{e^{t(S_m-\mathbb{E}[S_m])}}] \\
&= e^{-t\epsilon} \prod_{i=1}^{n} \mathbb{E}[{e^{t(X_i-\mathbb{E}[X_i])}}] \\
&\le e^{-t\epsilon} \prod_{i=1}^{n} e^{\frac{t^2(b_i-a_i)^2}{8}} \\
&= e^{-t\epsilon} e^{\frac{t^2 \sum_{i=1}^{n} (b_i-a_i)^2}{8}},
\end{aligned}
$$

now we choose $t = \frac{4\epsilon}{\sum_{i=1}^{n} (b_i-a_i)^2}$ to minimize the upper bound:

$$
\begin{aligned}
P\left( S_m - \mathbb{E}[S_m] \geq \epsilon \right)
&\le e^{-t\epsilon} e^{\frac{t^2 \sum_{i=1}^{n} (b_i-a_i)^2}{8}}\\
&\le e^{\frac{-2\epsilon^2}{\sum_{i=1}^{n} (b_i-a_i)^2}}.
\end{aligned}
$$

The above technique is known as **Chernoff bounding technique**, and this result is constant for $P\left( S_m - \mathbb{E}[S_m] \leq \epsilon \right)$. 
Therefore, we have:

$$
P\left( \left| S_n - \mathbb{E}[S_n] \right| \geq \epsilon \right) \leq 2 \exp\left( -\frac{2 \epsilon^2}{\sum_{i=1}^{n}(b_i - a_i)^2} \right)
$$

where we can similarly derive the result for $\bar{X}$, as $S_n = n\bar{X}$ and $\mathbb{E}[S_n] = n\mu$, we have:

$$
P\left( \left| n\bar{X} - n\mu \right| \geq \epsilon \right) \leq 2 \exp\left( -\frac{2 \epsilon^2}{\sum_{i=1}^{n}(b_i - a_i)^2} \right),
$$

let $\epsilon = n\cdot t$, we have:

$$
P\left( \left| \bar{X} - \mu \right| \geq t \right) \leq 2 \exp\left( -\frac{2 n^2 t^2}{\sum_{i=1}^{n}(b_i - a_i)^2} \right),
$$

Q.E.D.

## 4. Generalization Bound

As Hoeffding's Inequality provides a way to bound the probability that the sum (or average) of bounded independent random variables deviates from its expected value, it is widely used in statistical learning theory to derive generalization bounds for machine learning algorithms.

Given a data distribution $\mathcal{D}$ over input space $\mathcal{X}$ and output space $\mathcal{Y}$, a hypothesis class $\mathcal{H}$, and a loss function $\mathcal{L}: \mathcal{Y} \times \mathcal{Y} \to [0,1]$, we define the true risk of a hypothesis $h \in \mathcal{H}$ as:

$$
R(h) = \mathbb{E}_{(x,y) \sim \mathcal{D}}[\mathcal{L}(h(x), y)],
$$

where the loss function is defined as:

$$
\mathcal{L}(h(x), y) = \begin{cases}1, & \text{if } h(x) \neq y \\ 0, & \text{if } h(x) = y \end{cases}.
$$

And the empirical risk on a training set $S = \{(x_i, y_i)\}_{i=1}^{m}$ as:

$$
\hat{R}_S(h) = \frac{1}{m} \sum_{i=1}^{m} \mathcal{L}(h(x_i), y_i).
$$
Using Hoeffding's inequality, we can derive a generalization bound that relates the true risk and empirical risk of a hypothesis. For a hypothesis $h \in \mathcal{H}$ and any $\epsilon > 0$, the following inequality holds:

$$
P\left( |R(h) - \hat{R}_S(h)| \geq \epsilon \right) \leq 2 \exp(-2m\epsilon^2),
$$

which is equivalent to that for any $\delta > 0$, with probability at least $1 - \delta$, the following holds: 

$$
R(h) \leq \hat{R}_S(h) + \sqrt{\frac{1}{2m} \log \left( \frac{2}{\delta} \right)}.
$$