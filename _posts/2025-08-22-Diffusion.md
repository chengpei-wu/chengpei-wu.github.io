---
layout: blog_post
title: Understanding Diffusion Models
date: 2025-10-10
tag: [generative modeling, diffusion models]
author: Chengpei Wu
excerpt: This post provides an introduction to Diffusion Models.
---

## 1. Diffusion Models

Diffusion models are a class of generative models that learn to generate data by reversing a diffusion process.

In this post, we introduce the fundamental concepts of diffusion models, including the forward and reverse diffusion processes, the training objectives, and how these models generate new data. 

We explore diffusion models from two complementary perspectives:
1. **Variational Inference Perspective:** We discuss how diffusion models relate to variational autoencoders (VAEs), and explain the equivalence between different training objectives for maximizing the evidence lower bound (ELBO), such as expectation-prediction, $x$-prediction, $\epsilon$-prediction, and score-prediction.
2. **Stochastic Differential Equation (SDE) Perspective:** We present the interpretation of diffusion models through reversed SDEs, offering a unified framework for understanding denoising diffusion models.


### 1.1. Forward and Reverse Diffusion Process

The main idea of diffusion models is **to define a forward diffusion process that gradually adds noise to the data, and a reverse diffusion process that learns to denoise and reconstruct the original data**.

**Forward Diffusion Process**: forward process is a predefined Markov chain that progressively adds Gaussian noise to the data over a series of time steps. which can be defined as:

$$
x_t = \sqrt{1 - \beta_t} x_{t-1} + \sqrt{\beta_t} \epsilon, \quad \epsilon \sim \mathcal{N}(0, \mathbf{I}),
$$

where $\beta_t$ is a variance schedule that controls the amount of noise added at each time step, which means the conditional distribution of $x_t$ given $x_{t-1}$ is:

$$
q(x_t \mid x_{t-1}) = \mathcal{N}(x_t; \sqrt{1 - \beta_t} x_{t-1}, \beta_t \mathbf{I}),
$$

**Reverse Diffusion Process**: reverse process is a learned Markov chain that aims to remove the added noise and recover the original data distribution. The reverse process can be defined as:

$$
x_{t-1} = \mu_\theta(x_t, t) + \Sigma_\theta(x_t, t) \epsilon, \quad \epsilon \sim \mathcal{N}(0, \mathbf{I}),
$$

where $\mu_\theta(x_t, t)$ and $\Sigma_\theta(x_t, t)$ are the mean and covariance functions. The conditional distribution of $x_{t-1}$ given $x_t$ is:

$$
p_\theta(x_{t-1} \mid x_t) = \mathcal{N}(x_{t-1}; \mu_\theta(x_t, t), \Sigma_\theta(x_t, t)),
$$

assuming that for each time step $t$, we konw the mean $\mu_\theta(x_t, t)$ and covariance $\Sigma_\theta(x_t, t)$ of the reverse process (parameterized by a neural network with parameters $\theta$), and prior distribution $p(x_T)=\mathcal{N}(x_T;0,\mathbf{I})$.  
Then, we can sample $x_0 \sim p_\theta(x_0)$ by iteratively applying the reverse process starting from sampling pure noise $x_T \sim \mathcal{N}(0,\mathbf{I})$ as follows:

$$
\begin{aligned}
&\text{sample noise:} \quad & x_T \sim \mathcal{N}(0, \mathbf{I}), \\
&\text{sample } x_{T-1}: \quad & x_{T-1} = \mu_\theta(x_T, T) + \Sigma_\theta(x_T, T) \epsilon, \quad \epsilon \sim \mathcal{N}(0, \mathbf{I}), \\ 
&\text{sample } x_{T-2}: \quad & x_{T-2} = \mu_\theta(x_{T-1}, T-1) + \Sigma_\theta(x_{T-1}, T-1) \epsilon, \quad \epsilon \sim \mathcal{N}(0, \mathbf{I}), \\
&\cdots \\
&\text{sample } x_0: \quad & x_0 = \mu_\theta(x_1, 1) + \Sigma_\theta(x_1, 1) \epsilon, \quad \epsilon \sim \mathcal{N}(0, \mathbf{I}).

\end{aligned}
$$

**Note that, there exactly exists a closed-form conditional distribution of 
$x_{t-1}$ given 
$x_t$ and $x_0$, 
$q(x_{t-1} \mid x_t, x_0)$ (we will derive it later). 
However, it is dependent on the original data $x_0$, which is unknown during inference. What we do is to approximate it using a parameterized distribution 
$p_\theta(x_{t-1} \mid x_t)$, while minimizing the difference between prior distrubution 
$p(x_T)$ and posterior distribution 
$p_\theta(x_T \mid x_0)$ (because we need make sure that the noise we starting from is indeed sampled from the end state of a Markov chain).**


## 2. Understanding Diffusion Model (Take 1, ELBO Perspective)

### 2.1. Maximizing Log-Likelihood
The goal of training a diffusion model is to learn the parameters $\theta$ of the reverse process such that the generated data distribution $p_\theta(x_0)$ matches the true data distribution $q(x_0)$.
So, $\theta$ can be updated by maximizing the log-likelihood of the true data points, that is, to maximize $\log p_\theta(x_0)$ (a.k.a. Maximizing Likelihood Estimation, MLE).

As defined 
$p_\theta(x_{t-1} \mid x_t)$ in Eq. (4), we can further define the **joint distribution $p_\theta(x_{0:T})$** using the rule of chain as:

$$
\begin{aligned}
p_\theta(x_{0:T}) &= p_\theta(x_0, x_1, \cdots, x_T)\\
&= p_\theta(x_T) \cdot p_\theta(x_{T-1} \mid x_T) \cdot p_\theta(x_{T-2} \mid x_{T-1}, x_T) \cdots p_\theta(x_0 \mid x_1, x_2, \cdots, x_T)\\
&= p_\theta(x_T) \prod_{t=1}^{T} p_\theta(x_{t-1} \mid x_t, x_2, \cdots, x_T), \\
\end{aligned}
$$

under the **Markov assumption**, it can be simplified as:

$$
\begin{aligned}
p_\theta(x_{0:T}) &= p_\theta(x_0, x_1, \cdots, x_T)\\
&= p_\theta(x_T) \cdot p_\theta(x_{T-1} \mid x_T) \cdot p_\theta(x_{T-2} \mid x_{T-1}) \cdots p_\theta(x_0 \mid x_1)\\
&= p_\theta(x_T) \prod_{t=1}^{T} p_\theta(x_{t-1} \mid x_t). \\
\end{aligned}
$$

So, the log-likelihood of the marginal distribution $p_\theta(x_0)$ is:

$$
\begin{aligned}
\log p_\theta(x_0) &= \log \frac{p_\theta(x_{0:T})}{p_\theta(x_{1:T} \mid x_0)}\\
&= \mathbb{E}_{q(x_{1:T} \mid x_0)} \left[ \log \frac{p_\theta(x_{0:T})}{p_\theta(x_{1:T} \mid x_0)} \right] \\
&= \mathbb{E}_{q(x_{1:T} \mid x_0)} \left[ \log \left( \frac{p_\theta(x_{0:T})}{q(x_{1:T} \mid x_0)} \cdot \frac{q(x_{1:T} \mid x_0)}{p_\theta(x_{1:T} \mid x_0)} \right) \right] \\
&= \mathbb{E}_{q(x_{1:T} \mid x_0)} \left[ \log \frac{p_\theta(x_{0:T})}{q(x_{1:T} \mid x_0)} \right] + \mathbb{E}_{q(x_{1:T} \mid x_0)} \left[ \log \frac{q(x_{1:T} \mid x_0)}{p_\theta(x_{1:T} \mid x_0)} \right] \\
& = \underbrace{\mathbb{E}_{q(x_{1:T} \mid x_0)} \left[ \log \frac{p_\theta(x_{0:T})}{q(x_{1:T} \mid x_0)} \right]}_\text{ELBO} + \underbrace{D_{KL}(q(x_{1:T} \mid x_0) || p_\theta(x_{1:T} \mid x_0))}_\text{KL divergence} \\
& \geq \text{ELBO},
\end{aligned}
$$

maximizing the log-likelihood $\log p_\theta(x_0)$ is equivalent to maximizing the **Evidence Lower Bound (ELBO)**.

### 2.2. Variational Lower Bound

So, we can define the loss function as the negative ELBO:

$$
\begin{aligned}
- \mathcal{L}_\text{ELBO}(\theta) &= \text{ELBO}\\
&= \mathbb{E}_{q(x_{1:T} \mid x_0)} \left[ \log \frac{p_\theta(x_{0:T})}{q(x_{1:T} \mid x_0)} \right] \\
&= \mathbb{E}_{q(x_{1:T} \mid x_0)} \left[ \log \frac{p(x_T) \prod_{t=1}^{T} \log p_\theta(x_{t-1} \mid x_t)} {\prod_{t=1}^{T} \log q(x_t \mid x_{t-1})} \right] \\
&= \mathbb{E}_{q(x_{1:T} \mid x_0)} \left[ \log p(x_T) + \sum_{t=2}^{T} \log \frac{p_\theta(x_{t-1} \mid x_t)}{\color{green}q(x_t \mid x_{t-1})} + \log \frac{p_\theta(x_0 \mid x_1)}{q(x_1 \mid x_{0})} \right]\\
&= \mathbb{E}_{q(x_{1:T} \mid x_0)} \left[ \log p(x_T) + \sum_{t=2}^{T} \log \frac{p_\theta(x_{t-1} \mid x_t)}{\color{green}q(x_t \mid x_{t-1}, x_0)} + \log \frac{p_\theta(x_0 \mid x_1)}{q(x_1 \mid x_{0})} \right]\\
&= \mathbb{E}_{q(x_{1:T} \mid x_0)} \left[ \log p(x_T) + \sum_{t=2}^{T} \log \frac{p_\theta(x_{t-1} \mid x_t)}{\color{green}\frac{q(x_t \mid x_0)\cdot q(x_{t-1} \mid x_t,x_0)}{q(x_{t-1} \mid x_0)}} + \log \frac{p_\theta(x_0 \mid x_1)}{q(x_1 \mid x_{0})} \right]\\
&= \mathbb{E}_{q(x_{1:T} \mid x_0)} \left[ \log p(x_T) + \sum_{t=2}^{T} \log {\color{purple}\frac{p_\theta(x_{t-1} \mid x_t)}{q(x_{t-1} \mid x_t,x_0)}} + \sum_{t=2}^{T} \log {\color{blue}\frac{q(x_{t-1} \mid x_0)}{q(x_{t} \mid x_0)}} + \log \frac{p_\theta(x_0 \mid x_1)}{q(x_1 \mid x_{0})} \right]\\
&= \mathbb{E}_{q(x_{1:T} \mid x_0)} \left[ \log p(x_T) + \sum_{t=2}^{T} \log \frac{p_\theta(x_{t-1} \mid x_t)}{q(x_{t-1} \mid x_t,x_0)} + \log {\color{blue}\frac{q(x_1 \mid x_0)}{q(x_T \mid x_0)}} + \log \frac{p_\theta(x_0 \mid x_1)}{q(x_1 \mid x_{0})} \right]\\
&= \mathbb{E}_{q(x_{1:T} \mid x_0)} \left[ \log \frac{p(x_T)}{q(x_T \mid x_0)} + \sum_{t=2}^{T} \log \frac{p_\theta(x_{t-1} \mid x_t)}{q(x_{t-1} \mid x_t,x_0)} + \log p_\theta(x_0 \mid x_1) \right]\\
&= \mathbb{E}_{\color{red}q(x_1 \mid x_0)} \left[ \log p_\theta(x_0 \mid x_1) \right] + \mathbb{E}_{\color{red}q(x_{T} \mid x_0)} \left[ \log \frac{p(x_T)}{q(x_T \mid x_0)} \right] + \sum_{t=2}^{T} \mathbb{E}_{\color{red}q(x_{t-1}, x_t \mid x_0)} \left [ \log \frac{p_\theta(x_{t-1} \mid x_t)}{q(x_{t-1} \mid x_t,x_0)} \right]\\
&= \underbrace{\mathbb{E}_{q(x_1 \mid x_0)} \left[ \log p_\theta(x_0 \mid x_1) \right]}_\text{reconstruction term}
- \underbrace{D_{KL}(q(x_T \mid x_0) || p(x_T))}_\text{prior matching term}
- \sum_{t=2}^{T} \underbrace{\mathbb{E}_{q(x_t \mid x_0)} \left[ D_{KL}(q(x_{t-1} \mid x_t,x_0) || p_\theta(x_{t-1} \mid x_t)) \right]}_\text{denoising matching term}, \\
\end{aligned}
$$

as we can see, the ELBO can be decomposed into three terms:
1. **Reconstruction Term**, which encourages the model to accurately reconstruct the original data from the slightly noised version $x_1$.
2. **Prior Matching Term**, which ensures that the distribution of the noised data at the final time step $T$ matches the prior distribution. It has no trainable parameters, and is also equal to zero under our assumptions.
3. **Denoising Matching Term**, which encourages the model to learn the reverse diffusion process by minimizing the KL divergence between the true posterior 
$q(x_{t-1} \mid x_t,x_0)$ and the learned reverse process $p_\theta(x_{t-1} \mid x_t)$ at each time step.


### 2.3. Optimizing Objective

As denoising matching term dominates the overall loss, our training objective can be simplified to minimizing the denoising matching term:

$$
\arg \min_\theta \mathbb{E}_{t\sim U[2, T], x_0 \sim q(x_0), x_t \sim q(x_t \mid x_0)} \left[ D_{KL}(q(x_{t-1} \mid x_t,x_0) || p_\theta(x_{t-1} \mid x_t)) \right].\\
$$

We have defined 
$p_\theta(x_{t-1} \mid x_t) = \mathcal{N}(\mu_\theta(x_t, t), \Sigma_\theta(x_t, t))$, now, let us derive the closed-form expression of 
$q(x_{t-1} \mid x_t,x_0)$:

$$
\begin{aligned}
q(x_{t-1} \mid x_t,x_0) &= 
\frac{ { \color{green}q(x_t \mid x_{t-1},x_0)} \cdot { \color{blue}q(x_{t-1} \mid x_0)}}{\color{red}q(x_t \mid x_0)},
\end{aligned}
$$

as we defined in Eq. (2), 
${\color{green}q(x_t \mid x_{t-1},x_0) = q(x_t \mid x_{t-1}) = \mathcal{N}(\sqrt{1 - \beta_t} x_{t-1}, \beta_t \mathbf{I})}$, what remains is deriving
${ \color{blue}q(x_{t-1} \mid x_0)}$ and $\color{red}q(x_t \mid x_0)$ as:

$$
\begin{aligned}
x_t &= \sqrt{1 - \beta_t} x_{t-1} + \sqrt{\beta_t} \epsilon_{t-1}\\
(\alpha_t := 1-\beta_t) &= \sqrt{\alpha_t} x_{t-1} + \sqrt{1-\alpha_t} \epsilon_{t-1}\\ 
&= \sqrt{\alpha_t} (\sqrt{\alpha_{t-1}} x_{t-2} + \sqrt{1-\alpha_{t-1}} \epsilon_{t-2}) + \sqrt{1-\alpha_t} \epsilon_{t-1}\\
&= \sqrt{\alpha_t \alpha_{t-1}} x_{t-2} + \sqrt{\alpha_t (1-\alpha_{t-1})} \epsilon_{t-2} + \sqrt{(1-\alpha_t)} \epsilon_{t-1}\\
& = \sqrt{\alpha_t \alpha_{t-1}} x_{t-2} + \sqrt{\sqrt{\alpha_t (1-\alpha_{t-1})}^2 + \sqrt{(1-\alpha_t)}^2} \bar{\epsilon} \\
&= \sqrt{\alpha_t \alpha_{t-1}} x_{t-2} + \sqrt{1 - \alpha_t \alpha_{t-1}} \bar{\epsilon}\\
&= \cdots \\
&= \sqrt{\alpha_t \alpha_{t-1} \cdots \alpha_1} x_0 + \sqrt{1 - \alpha_t \alpha_{t-1} \cdots \alpha_1} \bar{\epsilon}\\
& = \sqrt{\bar{\alpha}_t} x_0 + \sqrt{1 - \bar{\alpha}_t} \epsilon, \quad \epsilon \sim \mathcal{N}(0, \mathbf{I}),
\end{aligned}
$$

where $\bar{\alpha}_t = \prod_{s=1}^{t} \alpha_s$. Therefore, we have:

$$
{\color{red}q(x_t \mid x_0)} = \mathcal{N}(\sqrt{\bar{\alpha}_t} x_0, (1 - \bar{\alpha}_t) \mathbf{I}),
$$

and

$$
{\color{blue}q(x_{t-1} \mid x_0)} = \mathcal{N}(\sqrt{\bar{\alpha}_{t-1}} x_0, (1 - \bar{\alpha}_{t-1}) \mathbf{I}).
$$

Now, we can rewrite Eq. (11) as:

$$
\begin{aligned}
q(x_{t-1} \mid x_t,x_0) &= \frac{ \mathcal{N}(\sqrt{\alpha_t} x_{t-1}, (1-\alpha_t) \mathbf{I}) \cdot \mathcal{N}(\sqrt{\bar{\alpha}_{t-1}} x_0, (1 - \bar{\alpha}_{t-1}) \mathbf{I})}{\mathcal{N}(\sqrt{\bar{\alpha}_t} x_0, (1 - \bar{\alpha}_t) \mathbf{I})}\\
&\propto \exp\left( -\frac{1}{2} \left( \frac{(x_{t} - \sqrt{\alpha_t} x_{t-1})^2}{1 - \alpha_t}  + \frac{(x_{t-1} - \sqrt{\bar{\alpha}_{t-1}} x_0)^2}{1 - \bar{\alpha}_{t-1}} - \frac{(x_{t} - \sqrt{\bar{\alpha}_{t}} x_0)^2}{1 - \bar{\alpha}_{t}} \right) \right) \\
&= \exp \left ( -\frac{1}{2} \left( \frac{(x_{t} - \sqrt{\alpha_t} x_{t-1})^2}{1 - \alpha_t}  + \frac{(x_{t-1} - \sqrt{\bar{\alpha}_{t-1}} x_0)^2}{1 - \bar{\alpha}_{t-1}} - \frac{(x_{t} - \sqrt{\bar{\alpha}_{t}} x_0)^2}{1 - \bar{\alpha}_{t}} \right) \right)\\
&\propto \exp \left( -\frac{1}{2} \left( \frac{\alpha_t x_{t-1}^2}{1 - \alpha_t} - \frac{2x_t \sqrt{\alpha_t} x_{t-1}}{1 - \alpha_t}  + \frac{x_{t-1}^2}{1 - \bar{\alpha}_{t-1}} - \frac{2 x_{t-1} \sqrt{\bar{\alpha}_{t-1}}x_0}{1 - \bar{\alpha}_{t-1}} \right) \right)\\
&= \exp \left( -\frac{1}{2} \left( \left(\frac{\alpha_t}{1 - \alpha_t} + \frac{1}{1 - \bar{\alpha}_{t-1}}\right) x_{t-1}^2 - 2 \left(\frac{x_t \sqrt{\alpha_t}}{1 - \alpha_t} + \frac{\sqrt{\bar{\alpha}_{t-1}} x_0}{1 - \bar{\alpha}_{t-1}}\right) x_{t-1} \right) \right)\\
&= \exp \left( -\frac{1}{2} \left( \frac{1-\bar{\alpha}_{t}}{(1-\alpha_t)(1-\bar{\alpha}_{t-1})} x_{t-1}^2 - 2 \left(\frac{x_t \sqrt{\alpha_t}}{1 - \alpha_t} + \frac{\sqrt{\bar{\alpha}_{t-1}} x_0}{1 - \bar{\alpha}_{t-1}}\right) x_{t-1} \right) \right)\\

&= \exp \left( -\frac{1}{2} \cdot \frac{1}{\frac{1-\bar{\alpha}_{t}}{(1-\alpha_t)(1-\bar{\alpha}_{t-1})}} \left( x_{t-1}^2 - 2 \left(\frac{\frac{x_t \sqrt{\alpha_t}}{1 - \alpha_t} + \frac{\sqrt{\bar{\alpha}_{t-1}} x_0}{1 - \bar{\alpha}_{t-1}}}{\frac{1-\bar{\alpha}_{t}}{(1-\alpha_t)(1-\bar{\alpha}_{t-1})}}\right) x_{t-1} \right) \right)\\

&= \exp \left( -\frac{1}{2} \cdot \frac{1}{\frac{1-\bar{\alpha}_{t}}{(1-\alpha_t)(1-\bar{\alpha}_{t-1})}} \left( x_{t-1}^2 - 2 \cdot \frac{1-\bar{\alpha}_{t-1} \sqrt{\alpha_t} \cdot x_t + (1-\alpha_t) \sqrt{\bar{\alpha}_{t-1}} x_0}{1-\bar{\alpha}_t} \cdot x_{t-1} \right) \right)\\

&= \exp \left( - \frac{1}{2 \cdot \frac{1-\bar{\alpha}_{t}}{(1-\alpha_t)(1-\bar{\alpha}_{t-1})}} \left( \left( x_{t-1} - \frac{1-\bar{\alpha}_{t-1} \sqrt{\alpha_t} x_t + (1-\alpha_t) \sqrt{\bar{\alpha}_{t-1}} x_0}{1-\bar{\alpha}_t} \right)^2 - \left( \frac{1-\bar{\alpha}_{t-1} \sqrt{\alpha_t} x_t + (1-\alpha_t) \sqrt{\bar{\alpha}_{t-1}} x_0}{1-\bar{\alpha}_t} \right)^2 \right)\right)\\

&\propto \exp \left( - \frac{1}{2 \cdot \frac{1-\bar{\alpha}_{t}}{(1-\alpha_t)(1-\bar{\alpha}_{t-1})}} \left( x_{t-1} - \frac{1-\bar{\alpha}_{t-1} \sqrt{\alpha_t} x_t + (1-\alpha_t) \sqrt{\bar{\alpha}_{t-1}} x_0}{1-\bar{\alpha}_t} \right)^2 \right)\\

&\propto \mathcal{N}\left( \frac{1-\bar{\alpha}_{t-1} \sqrt{\alpha_t} x_t + (1-\alpha_t) \sqrt{\bar{\alpha}_{t-1}} x_0}{1-\bar{\alpha}_t}, \frac{1-\bar{\alpha}_{t}}{(1-\alpha_t)(1-\bar{\alpha}_{t-1})} \mathbf{I} \right).\\

\end{aligned}
$$

Let $\mu_q = \frac{1-\bar{\alpha}_{t-1} \sqrt{\alpha_t} x_t + (1-\alpha_t) \sqrt{\bar{\alpha}_{t-1}} x_0}{1-\bar{\alpha}_t}$ and $\Sigma_q = \frac{1-\bar{\alpha}_{t}}{(1-\alpha_t)(1-\bar{\alpha}_{t-1})} \mathbf{I}$.
We have shown that 
$x_{t-1} \sim q(x_{t-1} \mid x_t,x_0) = \mathcal{N}\left( \frac{1-\bar{\alpha}_{t-1} \sqrt{\alpha_t} x_t + (1-\alpha_t) \sqrt{\bar{\alpha}_{t-1}} x_0}{1-\bar{\alpha}_t}, \frac{1-\bar{\alpha}_{t}}{(1-\alpha_t)(1-\bar{\alpha}_{t-1})} \mathbf{I} \right)$ is also a Gaussian distribution. In addition, we can see that the variance of
$q(x_{t-1} \mid x_t,x_0)$ is a function of the variance schedule $\beta_t$, which is predefined and fixed during training.

Recall that the KL Divergence between two Gaussian distributions is:

$$
D_{KL}(\mathcal{N}(\mu_1, \Sigma_1) || \mathcal{N}(\mu_2, \Sigma_2)) = \frac{1}{2} \left( \log \frac{|\Sigma_2|}{|\Sigma_1|} - k + \text{tr}(\Sigma_2^{-1} \Sigma_1) + (\mu_2 - \mu_1)^T \Sigma_2^{-1} (\mu_2 - \mu_1) \right),
$$

Now, we can compute the KL divergence
$D_{KL}(q(x_{t-1} \mid x_t,x_0) || p_\theta(x_{t-1} \mid x_t))$ in Eq. (10) as:

$$
\begin{aligned}
D_{KL}(q(x_{t-1} \mid x_t,x_0) || p_\theta(x_{t-1} \mid x_t)) &= D_{KL} \left( \mathcal{N}\left( \mu_q, \Sigma_q \right) || \mathcal{N}(\mu_\theta(x_t, t), \Sigma_\theta(x_t, t)) \right)\\
&= \frac{1}{2} \left( \log \frac{|\Sigma_\theta(x_t, t)|}{|\Sigma_q|} - k + \text{tr}(\Sigma_\theta^{-1} \Sigma_q) + (\mu_\theta(x_t, t) - \mu_q)^T \Sigma_\theta^{-1} (\mu_\theta(x_t, t) - \mu_q) \right),
\end{aligned}
$$

to minimize the KL divergence, we can set the covariance of the learned reverse process $\Sigma_\theta(x_t, t)=\Sigma_q$, because $\Sigma_q$ is known fixed (we do not need to estimate it by a parameterized function). so we only need to optimize the mean function $\mu_\theta(x_t, t)$ by minimizing the following objective:

$$
\begin{aligned}
D_{KL}(q(x_{t-1} \mid x_t,x_0) || p_\theta(x_{t-1} \mid x_t)) &= \frac{1}{2} \left[ (\mu_\theta(x_t, t) - \mu_q)^T \Sigma_q^{-1} (\mu_\theta(x_t, t) - \mu_q ) \right]\\
&= \frac{1}{2\Sigma_q} ||\mu_\theta(x_t, t) - \mu_q||^2_2\\
&= \frac{(1-\alpha_t)(1-\bar{\alpha}_{t-1})}{2(1-\bar{\alpha}_{t})} ||\mu_\theta(x_t, t) - \frac{1-\bar{\alpha}_{t-1} \sqrt{\alpha_t} x_t + (1-\alpha_t) \sqrt{\bar{\alpha}_{t-1}} x_0}{1-\bar{\alpha}_t}||^2_2.\\
\end{aligned}
$$

Plugging it back to Eq. (10), our training objective is:

$$
\begin{aligned}
&\arg \min_\theta \mathbb{E}_{t\sim U[2, T], x_0 \sim q(x_0), x_t \sim q(x_t \mid x_0)} \left[ \frac{(1-\alpha_t)(1-\bar{\alpha}_{t-1})}{2(1-\bar{\alpha}_{t})} ||\mu_\theta(x_t, t) - \frac{1-\bar{\alpha}_{t-1} \sqrt{\alpha_t} x_t + (1-\alpha_t) \sqrt{\bar{\alpha}_{t-1}} x_0}{1-\bar{\alpha}_t}||^2_2 \right]\\
&= \arg \min_\theta \mathbb{E}_{t\sim U[2, T], x_0 \sim q(x_0), x_t \sim q(x_t \mid x_0)} \left[ ||\mu_\theta(x_t, t) - \frac{1-\bar{\alpha}_{t-1} \sqrt{\alpha_t} x_t + (1-\alpha_t) \sqrt{\bar{\alpha}_{t-1}} x_0}{1-\bar{\alpha}_t}||^2_2 \right],\\

\end{aligned}
$$

**In fact, we can now training a neural network $\mu_\theta(x_t, t)$ by minimizing the above MSE loss, because the right-hand side of the MSE loss is known (we can sample $x_t$ from 
$q(x_t \mid x_0)$, and we have the closed-form expression of it). Then we can use the trained model to generate new data by iteratively applying the learned reverse process defined in Eq. (5).**

### 2.4. Equivalent Training Objectives

We name the above training objective as **Predicting Expectation**, which can be formally written as:

$$
\theta^* = \arg \min_\theta \mathbb{E}_{t\sim U[2, T], x_0 \sim q(x_0), x_t \sim q(x_t \mid x_0)} \left[ ||\mu_\theta(x_t, t) - \frac{1-\bar{\alpha}_{t-1} \sqrt{\alpha_t} x_t + (1-\alpha_t) \sqrt{\bar{\alpha}_{t-1}} x_0}{1-\bar{\alpha}_t}||^2_2 \right].
$$

Look at the right-hand side of the MSE loss, it is a function of $x_t$, $t$, and $x_0$, as $\mu_\theta(x_t, t)$ is a function of $x_t$ and $t$, so what we actually learn is $x_0$ (if it is only a function of $x_t$ and $t$, we do not need to train a neural network to approximate it, we can directly use the analytical solution as our model $\mu_\theta(x_t, t)$).

Therefore, we can re-parameterize the model $\mu_\theta(x_t, t)$ as a function of $x_t$, $t$, and a new neural network $x_\theta(x_t, t)$ that predicts $x_0$ as:

$$
\mu_\theta(x_t, t) = \frac{1-\bar{\alpha}_{t-1} \sqrt{\alpha_t} x_t + (1-\alpha_t) \sqrt{\bar{\alpha}_{t-1}} x_\theta(x_t, t)}{1-\bar{\alpha}_t},
$$

then, the training objective can be rewritten as:

$$
\begin{aligned}
\theta^* &= \arg \min_\theta \mathbb{E}_{t\sim U[2, T], x_0 \sim q(x_0), x_t \sim q(x_t \mid x_0)} \left[ ||\frac{1-\bar{\alpha}_{t-1} \sqrt{\alpha_t} x_t + (1-\alpha_t) \sqrt{\bar{\alpha}_{t-1}} x_\theta(x_t, t)}{1-\bar{\alpha}_t} - \frac{1-\bar{\alpha}_{t-1} \sqrt{\alpha_t} x_t + (1-\alpha_t) \sqrt{\bar{\alpha}_{t-1}} x_0}{1-\bar{\alpha}_t}||^2_2 \right]\\
&= \arg \min_\theta \mathbb{E}_{t\sim U[2, T], x_0 \sim q(x_0), x_t \sim q(x_t \mid x_0)} \left[ \frac{(1-\alpha_t) \sqrt{\bar{\alpha}_{t-1}} }{1-\bar{\alpha}_t} ||(x_\theta(x_t, t) - x_0)||^2_2 \right],\\
&= \arg \min_\theta \mathbb{E}_{t\sim U[2, T], x_0 \sim q(x_0), x_t \sim q(x_t \mid x_0)} \left[ ||x_\theta(x_t, t) - x_0||^2_2 \right],\\
\end{aligned}
$$

we name the above training objective as **Predicting $x_0$**, which is equivalent to the previous objective **Predicting Expectation**.

As shown in Eq. (12), $x_0$ also can be formulated as a function of $x_t$ and a noise $\epsilon$ as:

$$
x_0 = \frac{x_t- \sqrt{1-\bar{\alpha}_t} \cdot \epsilon}{\sqrt{\bar{\alpha}_t}}, \quad \epsilon \sim \mathcal{N}(0, \mathbf{I}),
$$

so we can further re-parameterize the model $x_\theta(x_t, t)$ as a function of $x_t$, $t$, and a new neural network $\epsilon_\theta(x_t, t)$ that predicts the noise $\epsilon$ as:

$$
x_\theta(x_t, t) = \frac{x_t- \sqrt{1-\bar{\alpha}_t} \cdot \epsilon_\theta(x_t, t)}{\sqrt{\bar{\alpha}_t}},
$$  

then, the training objective can be rewritten as:

$$
\begin{aligned}
\theta^* &= \arg \min_\theta \mathbb{E}_{t\sim U[2, T], x_0 \sim q(x_0), x_t \sim q(x_t \mid x_0)} \left[ ||\frac{x_t- \sqrt{1-\bar{\alpha}_t} \cdot \epsilon_\theta(x_t, t)}{\sqrt{\bar{\alpha}_t}} - \frac{x_t- \sqrt{1-\bar{\alpha}_t} \cdot \epsilon}{\sqrt{\bar{\alpha}_t}}||^2_2 \right]\\
&= \arg \min_\theta \mathbb{E}_{t\sim U[2, T], x_0 \sim q(x_0), x_t \sim q(x_t \mid x_0)} \left[ \frac{\sqrt{1-\bar{\alpha}_t}}{\sqrt{\bar{\alpha}_t}} ||\epsilon_\theta(x_t, t) - \epsilon||^2_2 \right],\\
&= \arg \min_\theta \mathbb{E}_{t\sim U[2, T], x_0 \sim q(x_0), x_t \sim q(x_t \mid x_0)} \left[ ||\epsilon_\theta(x_t, t) - \epsilon||^2_2 \right],\\
\end{aligned}
$$

we name the above training objective as **Predicting Noise**, which is equivalent to the previous two objectives **Predicting $x_0$** and **Predicting Expectation**.

There is another equivalent training objective called **Predicting Score**, which is to train a neural network 
$s_\theta(x_t, t)$ to approximate the score function 
$\nabla_{x_t} \log p(x_t)$. The score function is derived from the **Tweedie Equation**:

$$
\mathbb{E}[\mu \mid z] = z + \Sigma \nabla_z \log p(z), \quad z \sim \mathcal{N}(\mu, \Sigma),
$$

as we know, 
$q(x_t \mid x_0) = \mathcal{N}(\sqrt{\bar{\alpha}_t} x_0, (1 - \bar{\alpha}_t) \mathbf{I})$, so we can apply the Tweedie Equation as: 

$$
\begin{aligned}
&\mathbb{E}[\mu \mid x_t] = \sqrt{\bar{\alpha}_t} x_0 = x_t + (1 - \bar{\alpha}_t) \nabla_{x_t} \log p(x_t)\\
&\Rightarrow x_0 = \frac{x_t}{\sqrt{\bar{\alpha}_t}} + \frac{(1 - \bar{\alpha}_t)}{\sqrt{\bar{\alpha}_t}} \nabla_{x_t} \log p(x_t).\\
\end{aligned}
$$

So, we can also re-parameterize the model 
$x_\theta(x_t, t)$ as a function of $x_t$, $t$, and a new neural network $s_\theta(x_t, t)$ that predicts the score function $\nabla_{x_t} \log p(x_t)$ as:

$$
x_\theta(x_t, t) = \frac{x_t}{\sqrt{\bar{\alpha}_t}} + \frac{(1 - \bar{\alpha}_t)}{\sqrt{\bar{\alpha}_t}} s_\theta(x_t, t),
$$ 

then, the training objective can be rewritten as:

$$
\begin{aligned}
\theta^* &= \arg \min_\theta \mathbb{E}_{t\sim U[2, T], x_0 \sim q(x_0), x_t \sim q(x_t \mid x_0)} \left[ ||\frac{x_t}{\sqrt{\bar{\alpha}_t}} + \frac{(1 - \bar{\alpha}_t)}{\sqrt{\bar{\alpha}_t}} s_\theta(x_t, t) - \frac{x_t}{\sqrt{\bar{\alpha}_t}} - \frac{(1 - \bar{\alpha}_t)}{\sqrt{\bar{\alpha}_t}} \nabla_{x_t} \log p(x_t)||^2_2 \right]\\
&= \arg \min_\theta \mathbb{E}_{t\sim U[2, T], x_0 \sim q(x_0), x_t \sim q(x_t \mid x_0)} \left[ \frac{(1 - \bar{\alpha}_t)}{\sqrt{\bar{\alpha}_t}} ||s_\theta(x_t, t) - \nabla_{x_t} \log p(x_t)||^2_2 \right],\\
&= \arg \min_\theta \mathbb{E}_{t\sim U[2, T], x_0 \sim q(x_0), x_t \sim q(x_t \mid x_0)} \left[||s_\theta(x_t, t) - \nabla_{x_t} \log p(x_t)||^2_2 \right].\\
\end{aligned}
$$


## 3. Understanding Diffusion Model (Take 2, ODE\SDE Perspective)

### 3.1. Notations

Let us first define some notations that will be used in this section:
- Let $X_t$ be a continuous-time random variable, where $t \in [0, 1]$.
- Let $d, \nabla, \nabla \cdot, \Delta$ are the differential, gradient, divergence, and Laplacian operators respectively.
- Let $W_t$ be a standard Wiener process (Brownian motion).

### 3.2. Discrete process to Continuous process

As we already defined, the forward diffusion process is a discrete-time Markov process:

$$
x_0 \rightarrow x_1 \rightarrow x_2 \rightarrow \cdots \rightarrow x_T,
$$

let us now consider the continuous-time limit of this process as $T \rightarrow \infty$. We can convert the discrete process $\{x_i \}_{i=0}^{T}$ to a continuous process $\{ x_t \}_{t=0}^{1}$ by defining:

$$
t = \frac{i}{T}, \quad \text{for } i = 0, 1, \ldots, T.
$$

Then, we can rewrite the forward diffusion process as:
$
x_{t_0} \rightarrow x_{t_1} \rightarrow x_{t_2} \rightarrow \cdots \rightarrow x_{t_T},
$where $x_{t_i} = x_i$. As $T \rightarrow \infty$, the time step $\Delta t = \frac{1}{T} \rightarrow 0$, and the discrete-time Markov process converges to a continuous-time stochastic process.

Recall that in Eq. (2), we defined the discrete forward diffusion process as:

$$
x_i = \sqrt{1 - \beta_i} x_{i-1} + \sqrt{\beta_i} \epsilon, \quad i=1,2,\ldots, T.
$$

Let $\beta(t) = \beta(\frac{i}{T}) := T \times \beta_i$, the continuous-time limit of this equation can be derived as follows: substituting $t$ with $t + \Delta t$, we have:

$$
\begin{aligned}
x_{t+\Delta t} &\overset{(i)}{=} \sqrt{1 - \beta(t+\Delta t) \Delta t} x_{t} + \sqrt{\beta(t+\Delta t) \Delta t} \epsilon\\
& \overset{(ii)}{=} (1 - \frac{1}{2} \beta_{t+\Delta t} \Delta t) x_t + \sqrt{\beta_{t+\Delta t} \Delta t} \epsilon\\
\Rightarrow x_{t+\Delta t} - x_t &\overset{(iii)}{=} - \frac{1}{2} \beta_{t+\Delta t} x_t \cdot \Delta t + \sqrt{\beta_{t+\Delta t}} \sqrt{\Delta t} \epsilon\\
\Rightarrow \frac{x_{t+\Delta t} - x_t}{\Delta t} &\overset{(iv)}{=} - \frac{1}{2} \frac{\beta_{t+\Delta t}}{\Delta t} x_t + \sqrt{\frac{\beta_{t+\Delta t}}{\Delta t}} \cdot \frac{\epsilon}{\sqrt{\Delta t}},\\   

\end{aligned} 
$$  