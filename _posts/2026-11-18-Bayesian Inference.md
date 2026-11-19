---
layout: blog_post
title: Bayesian Inference
date: 2026-11-12
tag: [statistical learning, Bayesian inference]
author: Chengpei Wu
excerpt: This post provides an introduction to Bayesian Inference.
---

## 1. Introduction

Bayesian inference is a statistical inference framework. It represents existing knowledge through prior distributions, updates the probability distributions of parameters using observed data, and performs estimation, prediction, and decision-making based on posterior distributions.

## 2. Notation

To facilitate the introduction, we introduce the following notations:
Let $$\mathcal{D}=\{(x_i,y_i)\}_{i=1}^{N}$$ denote the observed dataset, where $$x_i \in \mathcal{X}$$ and $$y_i\in\mathcal{Y}$$ represent the input and output of the $$i$$-th observation, respectively. We use $$\boldsymbol{\theta}\in\Theta$$ to denote the prior, which represents our initial probabilistic assumptions about the unknown parameters of the data-generating mechanism, with $$p(\boldsymbol{\theta})$$ representing the prior distribution. The likelihood of the observed data is denoted by $$p(\mathcal{D}\mid\boldsymbol{\theta})$$, and the posterior distribution is written as $$p(\boldsymbol{\theta}\mid\mathcal{D})$$. For a new input $$x_*$$, let $$y_*$$ denote its corresponding unknown output. We use $$p(y_* \mid x_*,\boldsymbol{\theta})$$ to represent the conditional predictive distribution given the prior, and $$p(y_*\mid x_*,\mathcal{D})$$ to denote the posterior predictive distribution obtained by marginalizing over the parameter posterior. Throughout, $$p(\cdot)$$ denotes a probability mass function or probability density function, as appropriate.

## 3. A look at **prior**, **likelihood**, and **posterior** in Bayesian Statistics.

- **Unknown Parameter**: the unknown parameter $$\boldsymbol{\theta}$$ represents the underlying characteristics of the **probabilistic model** that we aim to infer. For example, tossing a coin, $$\boldsymbol{\theta}$$ could represent the probability of getting heads. In a linear regression model, $$\boldsymbol{\theta}$$ could represent the coefficients of the linear equation.

- **Prior**: Usually, we have some prior knowledge or beliefs about the unknown parameter $$\boldsymbol{\theta}$$ before observing the data. This prior knowledge is represented by a prior distribution $$p(\boldsymbol{\theta})$$ (or just called the prior). For example, if we believe that a coin is fair, we might set a prior distribution that $$\boldsymbol{\theta} \sim \text{Beta}(10,10)$$, which indicates that the probability of getting heads is likely to be around 0.5, if we have no prior knowledge, we might set a uniform prior distribution $$\boldsymbol{\theta} \sim \text{Beta}(1,1)$$, which indicates that the probability of getting heads is equally likely to be anywhere between 0 and 1.

- **Likelihood**: The likelihood function $$p(\mathcal{D}\mid\boldsymbol{\theta})$$ represents the probability of observing the data $$\mathcal{D}$$ given the unknown parameter $$\boldsymbol{\theta}$$. It quantifies how well the probabilistic model with parameter $$\boldsymbol{\theta}$$ explains the observed data. For example, if we observe 7 heads and 3 tails in 10 coin tosses, the likelihood function would be $$p(\mathcal{D}\mid\boldsymbol{\theta}) = \binom{10}{7} \boldsymbol{\theta}^7 (1-\boldsymbol{\theta})^3$$.

- **Posterior**: The posterior distribution $$p(\boldsymbol{\theta}\mid\mathcal{D})$$ represents the updated beliefs about the unknown parameter $$\boldsymbol{\theta}$$ after observing the data $$\mathcal{D}$$. 

Through Bayes' theorem, we can link the prior, likelihood, and posterior as follows:

$$
p(\boldsymbol{\theta}\mid\mathcal{D}) = \frac{p(\mathcal{D}\mid\boldsymbol{\theta})p(\boldsymbol{\theta})}{p(\mathcal{D})} = \frac{p(\mathcal{D}\mid\boldsymbol{\theta})p(\boldsymbol{\theta})}{\int p(\mathcal{D}\mid\boldsymbol{\theta})p(\boldsymbol{\theta})d\boldsymbol{\theta}} \propto p(\mathcal{D}\mid\boldsymbol{\theta})p(\boldsymbol{\theta})
$$

## 4. Bayesian Inference

**The method that uses Bayes' theorem to update the probability distribution of the unknown parameter $$\boldsymbol{\theta}$$ (can be latent variables, classes, etc.) based on observed data $$\mathcal{D}$$ is called Bayesian inference.**

<div class="example-card" markdown="1">

**Example 1: Bayesian Inference on Coin Tossing.** 
Consider a coin toss experiment where we want to estimate the probability of getting heads:

$$
X\mid\boldsymbol{\theta} \sim P(X\mid\boldsymbol{\theta}) = \text{Bernoulli}(\boldsymbol{\theta}),
$$

where $$P(X=1\mid\boldsymbol{\theta})=\boldsymbol{\theta}$$ and $$P(X=0\mid\boldsymbol{\theta})=1-\boldsymbol{\theta}$$. Let us begin with a prior distribution:

$$
\begin{aligned}
\boldsymbol{\theta} &\sim \text{Beta}(\alpha,\beta), \alpha, \beta = 1 \\ 
\implies p(\boldsymbol{\theta}) &=
\frac{1}{\int_0^1
t^{\alpha-1}(1-t)^{\beta-1}dt}
\theta^{\alpha-1}(1-\theta)^{\beta-1} \\
&= \frac{1}{\int_0^1
t^{0}(1-t)^{0}dt}
\theta^{0}(1-\theta)^{0} \\
&= 1 \\
&= \text{Uniform}(0,1)
\end{aligned}
$$

which is a uniform distribution over the interval [0,1]. After observing 7 heads and 3 tails in 10 coin tosses, we can update our beliefs about $$\boldsymbol{\theta}$$ using Bayes' theorem. The likelihood function is given by:

$$
p(\mathcal{D}\mid\boldsymbol{\theta}) = \binom{10}{7} \boldsymbol{\theta}^7 (1-\boldsymbol{\theta})^3,
$$

Thus, the posterior distribution is:

$$
\begin{aligned}
p(\boldsymbol{\theta}\mid\mathcal{D}) &= \frac{p(\mathcal{D}\mid\boldsymbol{\theta})p(\boldsymbol{\theta})}{p(\mathcal{D})} \\
&= \frac{\binom{10}{7} \boldsymbol{\theta}^7 (1-\boldsymbol{\theta})^3 \cdot 1}{\int_0^1 \binom{10}{7} t^7 (1-t)^3 dt} \\
&= \frac{\boldsymbol{\theta}^7 (1-\boldsymbol{\theta})^3}{\int_0^1 t^7 (1-t)^3 dt} \\
&= \text{Beta}(8,4)
\end{aligned}
$$

Therefore, we have updated our beliefs about the probability of getting heads from a uniform distribution to a Beta(8,4) distribution, which has a mean of 0.6667 and a variance of 0.0167. This indicates that after observing the data, we believe that the probability of getting heads is likely to be around 0.6667, with some uncertainty.

**Note that**, the uknown parameter $$\boldsymbol{\theta}$$ now is still a random variable, we can estimate its value from different perspectives, such as the mean, median, or mode of the posterior distribution. In this case, the mean of the posterior distribution is 0.6667, which can be used as a **point estimate** for $$\boldsymbol{\theta}$$.

</div>

## 5. From Bayesian Inference to Bayesian Prediction

So far, we have completed parameter inference: we have updated our beliefs about the unknown parameter $$\boldsymbol{\theta}$$ based on the observed data $$\mathcal{D}$$. However, in many cases, **we are also interested in making predictions about future observations**. This is where Bayesian prediction comes into play.

<div class="example-card" markdown="1">

**Example 2: Bayesian Prediction on Coin Tossing.** 
As we have already updated our beliefs about $$\boldsymbol{\theta}$$ from $$p(\boldsymbol{\theta})=\text{Uniform}(0,1)$$ to $$p(\boldsymbol{\theta}\mid\mathcal{D})=\text{Beta}(8,4)$$, we can now use the posterior distribution to make predictions about future observations.

For a new coin toss, let $$X_*$$ denote the outcome of the toss, where $$X_* \sim \text{Bernoulli}(\boldsymbol{\theta})$$, because $$\boldsymbol{\theta}$$ is now a random variable, we do not know its exact value, but we can use the posterior distribution to make predictions about $$X_*$$. The **posterior predictive distribution (PPD)** is given by:

$$
\begin{aligned}
p(X_* \mid \mathcal{D}) &= \int_0^1 p(X_* \mid \boldsymbol{\theta}) p(\boldsymbol{\theta} \mid \mathcal{D}) d\boldsymbol{\theta}\\
&= \int_0^1 \boldsymbol{\theta}^{X_*} (1-\boldsymbol{\theta})^{1-X_*} \frac{1}{\int_0^1 t^7 (1-t)^3 dt} \boldsymbol{\theta}^{7} (1-\boldsymbol{\theta})^{3} d\boldsymbol{\theta}\\
&= \frac{\int_0^1 \boldsymbol{\theta}^{X_* + 7} (1-\boldsymbol{\theta})^{1-X_* + 3} d\boldsymbol{\theta}}{\int_0^1 t^7 (1-t)^3 dt}\\
&= \frac{B(X_* + 8, 1 - X_* + 4)}{B(8, 4)}\\
&\implies p(X_* = 1 \mid \mathcal{D})= \frac{B(9, 4)}{B(8, 4)} = \frac{8}{12} = \frac{2}{3},\\
&\implies p(X_* = 0 \mid \mathcal{D})= \frac{B(8, 5)}{B(8, 4)} = \frac{4}{12} = \frac{1}{3},\\
&\implies
p(X_*\mid\mathcal D)
=
\left(\frac23\right)^{X_*}
\left(\frac13\right)^{1-X_*}\\
&= \text{Bernoulli}\left(\frac23\right)
\end{aligned}
$$

So, after observing 7 heads and 3 tails in 10 coin tosses, we can predict that the probability of getting heads in the next toss is $$\frac{2}{3}$$, and the probability of getting tails is $$\frac{1}{3}$$.
</div>

## 6. Approximating the Posterior Predictive Distribution

As shown in Example 2, we used the **posterior predictive distribution** to make predictions about future observations, which requires **integrating over the posterior distribution** of the unknown parameter $$\boldsymbol{\theta}$$. However, in real-world applications, this integration can be computationally expensive or even intractable, especially when the parameter space is high-dimensional. 

We may need to use **approximation methods** to estimate the posterior predictive distribution. Some common methods include: **Markov Chain Monte Carlo (MCMC)** methods, **Variational Inference**, and **Laplace Approximation**. These methods allow us to approximate the posterior distribution and make predictions about future observations without having to compute the exact integral.

Or, we can use **Plug-in Prediction** methods, where we replace the distribution of the parameter $$\boldsymbol{\theta}$$ with a point estimate, such as Mean value of the posterior, Maximum A Posteriori (MAP) or Maximum Likelihood Estimation (MLE). For example, we can use the MAP estimate of $$\boldsymbol{\theta}$$ to make predictions about future observations:
$$
p(X_* \mid \mathcal{D}) \approx p(X_* \mid \hat{\boldsymbol{\theta}}),
$$
where $$\hat{\boldsymbol{\theta}}$$ is the MAP estimate of $$\boldsymbol{\theta}$$:

$$
\hat{\boldsymbol{\theta}} = \arg\max_{\boldsymbol{\theta}} p(\boldsymbol{\theta} \mid \mathcal{D})
$$

## 7. Conclusion

In this post, we have introduced the basic concepts of Bayesian inference, including prior, likelihood, and posterior distributions. We have also discussed how to use Bayes' theorem to update our beliefs about unknown parameters based on observed data and how to make predictions about future observations using the posterior predictive distribution. Finally, we have highlighted some approximation methods for estimating the posterior predictive distribution when exact integration is computationally challenging.