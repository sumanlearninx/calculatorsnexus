from calculators.models import SEO, Category, Calculator, FAQ


def seed_finance():
    finance = Category.objects.get(name='Finance')
    results = []

    calculators = [
        {
            'slug':              'emi-calculator',
            'name':              'EMI Calculator',
            'icon':              '🏦',
            'short_description': 'Calculate monthly EMI for home, car and personal loans instantly.',
            'description':       'An EMI Calculator helps you calculate the fixed monthly payment to repay your loan.',
            'how_to_use':        '1. Enter Loan Amount\n2. Enter Annual Interest Rate\n3. Enter Tenure in Years',
            'formula':           'EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)',
            'example':           'Loan: 100,000 | Rate: 12% | 10 Years → EMI: 1,435',
            'is_featured':       True,
            'is_new':            True,
            'order':             1,
            'meta_title':        'EMI Calculator – Free Loan EMI Calculator | CalculatorsNexus',
            'meta_description':  'Calculate your monthly EMI for home loan, car loan instantly.',
            'meta_keywords':     'EMI calculator, loan calculator, home loan EMI',
            'faqs': [
                ('What is EMI?', 'EMI stands for Equated Monthly Installment — fixed monthly loan payment.', 1),
                ('How is EMI calculated?', 'EMI = P × r × (1+r)^n / ((1+r)^n - 1)', 2),
                ('Can I reduce my EMI?', 'Yes — larger down payment, longer tenure or lower interest rate.', 3),
                ('Is this calculator accurate?', 'Yes, uses the standard bank formula. Minor variations possible due to fees.', 4),
            ]
        },
        {
            'slug':              'sip-calculator',
            'name':              'SIP Calculator',
            'icon':              '📈',
            'short_description': 'Calculate returns on your monthly SIP investments.',
            'description':       'A SIP Calculator estimates the future value of your regular monthly investments.',
            'how_to_use':        '1. Enter Monthly Investment\n2. Enter Expected Annual Return\n3. Enter Time Period',
            'formula':           'FV = P × ({[1 + r]^n - 1} / r) × (1 + r)',
            'example':           'Monthly: 10,000 | Return: 12% | 10 Years → Total: 23,23,391',
            'is_featured':       True,
            'is_new':            True,
            'order':             2,
            'meta_title':        'SIP Calculator – Free SIP Returns Calculator | CalculatorsNexus',
            'meta_description':  'Calculate SIP returns and see how your monthly investments grow.',
            'meta_keywords':     'SIP calculator, systematic investment plan, mutual fund calculator',
            'faqs': [
                ('What is SIP?', 'SIP is Systematic Investment Plan — investing a fixed amount monthly in mutual funds.', 1),
                ('How are SIP returns calculated?', 'Using compound interest formula on monthly investments.', 2),
                ('What is a good return rate?', 'Equity funds historically return 10-15% annually.', 3),
                ('Is SIP better than lump sum?', 'SIP reduces risk through rupee cost averaging — better for salaried individuals.', 4),
            ]
        },
        {
            'slug':              'simple-interest-calculator',
            'name':              'Simple Interest Calculator',
            'icon':              '💵',
            'short_description': 'Calculate simple interest on any principal amount instantly.',
            'description':       'A Simple Interest Calculator helps you calculate the interest earned or paid on a principal amount over a period of time at a fixed interest rate. Unlike compound interest, simple interest is calculated only on the original principal — not on accumulated interest. It is commonly used for short term loans, fixed deposits, and savings accounts.',
            'how_to_use':        '1. Enter the Principal Amount (initial investment or loan)\n2. Enter the Annual Interest Rate (%)\n3. Enter the Time Period in Years\n4. Results update automatically\n5. View the Yearly Breakdown table to see interest growth year by year',
            'formula':           'Simple Interest (SI) = (P × R × T) / 100\nTotal Amount (A)   = P + SI\n\nWhere:\nP = Principal Amount\nR = Annual Interest Rate (%)\nT = Time Period (Years)',
            'example':           'Principal:     100,000\nInterest Rate: 10% per year\nTime Period:   5 Years\n\nSimple Interest = (100,000 × 10 × 5) / 100\n                = 50,000\nTotal Amount    = 100,000 + 50,000\n                = 150,000',
            'is_featured':       True,
            'is_new':            True,
            'order':             3,
            'meta_title':        'Simple Interest Calculator – Free SI Calculator | CalculatorsNexus',
            'meta_description':  'Calculate simple interest instantly. Enter principal, rate and time to get interest earned and total amount.',
            'meta_keywords':     'simple interest calculator, SI calculator, interest calculator, principal interest time',
            'faqs': [
                (
                    'What is Simple Interest?',
                    'Simple Interest is calculated only on the original principal amount. The formula is SI = (P × R × T) / 100, where P is principal, R is rate, and T is time in years.',
                    1
                ),
                (
                    'What is the difference between Simple and Compound Interest?',
                    'Simple interest is calculated only on the principal. Compound interest is calculated on principal plus previously earned interest. Compound interest grows faster over time.',
                    2
                ),
                (
                    'Where is Simple Interest used?',
                    'Simple interest is used in short term loans, car loans, some fixed deposits, treasury bills, and simple savings accounts.',
                    3
                ),
                (
                    'Can time be in months instead of years?',
                    'Yes. If time is in months, divide by 12 in the formula: SI = (P × R × T/12) / 100. Our calculator uses years for simplicity.',
                    4
                ),
                (
                    'Is simple interest better than compound interest for borrowers?',
                    'Yes — as a borrower, simple interest means you pay less total interest compared to compound interest over the same period.',
                    5
                ),
            ]
        },
        {
            'slug':              'loan-calculator',
            'name':              'Loan Calculator',
            'icon':              '💳',
            'short_description': 'Calculate monthly payments, total interest and repayment schedule for any loan.',
            'description':       'A Loan Calculator helps you calculate the monthly payment, total interest and total repayment amount for any type of loan. It supports both Reducing Balance (standard EMI) and Flat Rate interest methods. Whether you are taking a personal loan, car loan, business loan or student loan, this calculator gives you a complete yearly repayment schedule so you know exactly what you are paying.',
            'how_to_use':        '1. Enter the Loan Amount\n2. Enter the Annual Interest Rate (%)\n3. Enter the Loan Term in Years\n4. Select the Interest Type (Reducing Balance or Flat Rate)\n5. Results update automatically\n6. View the Yearly Repayment Schedule for a full breakdown',
            'formula':           'Reducing Balance:\nEMI = P × r × (1 + r)^n / ((1 + r)^n - 1)\n\nFlat Rate:\nMonthly Payment = (P + P × R × T) / (T × 12)\n\nWhere:\nP = Principal Loan Amount\nR = Annual Interest Rate\nr = Monthly Interest Rate (R / 12 / 100)\nT = Loan Term in Years\nn = Total Months (T × 12)',
            'example':           'Loan Amount:   50,000\nInterest Rate: 10% per year\nLoan Term:     5 Years\nType:          Reducing Balance\n\nMonthly Payment = 1,062\nTotal Interest  = 13,748\nTotal Payment   = 63,748',
            'is_featured':       True,
            'is_new':            True,
            'order':             5,
            'meta_title':        'Loan Calculator – Free Monthly Payment Calculator | CalculatorsNexus',
            'meta_description':  'Calculate monthly loan payments, total interest and repayment schedule for personal, car, business and student loans.',
            'meta_keywords':     'loan calculator, monthly payment calculator, personal loan calculator, flat rate calculator, reducing balance calculator',
            'faqs': [
                (
                    'What is the difference between Reducing Balance and Flat Rate?',
                    'Reducing Balance calculates interest on the outstanding loan balance each month — so as you repay, interest decreases. Flat Rate calculates interest on the original principal throughout the loan term, making it more expensive overall.',
                    1
                ),
                (
                    'Which interest type is better for borrowers?',
                    'Reducing Balance is always better for borrowers as the effective interest rate is lower. A Flat Rate of 10% is equivalent to roughly 18-20% on a Reducing Balance basis.',
                    2
                ),
                (
                    'Can I use this for car loans?',
                    'Yes. Enter the car loan amount, the annual interest rate offered by your bank or dealer, and the loan term. The calculator works for all loan types including personal, car, home, business and student loans.',
                    3
                ),
                (
                    'What happens if I pay more than the EMI?',
                    'Paying extra reduces your principal faster, which reduces future interest and shortens the loan term. This calculator shows the standard schedule — consult your lender for prepayment terms.',
                    4
                ),
                (
                    'Is the monthly payment the same every month?',
                    'For Reducing Balance loans, the EMI stays the same every month but the split between principal and interest changes. For Flat Rate loans, both principal and interest portions are equal each month.',
                    5
                ),
            ]
        },
    ]

    for data in calculators:
        seo = SEO.objects.create(
            meta_title       = data['meta_title'],
            meta_description = data['meta_description'],
            meta_keywords    = data.get('meta_keywords', ''),
            robots           = 'index, follow',
            schema_type      = 'SoftwareApp',
        )
        calc, created = Calculator.objects.get_or_create(
            slug=data['slug'],
            defaults={
                'category':          finance,
                'name':              data['name'],
                'icon':              data['icon'],
                'short_description': data['short_description'],
                'description':       data['description'],
                'how_to_use':        data['how_to_use'],
                'formula':           data['formula'],
                'example':           data['example'],
                'is_featured':       data.get('is_featured', False),
                'is_new':            data.get('is_new', False),
                'order':             data.get('order', 0),
                'seo':               seo,
            }
        )
        if created:
            for question, answer, order in data.get('faqs', []):
                FAQ.objects.create(
                    calculator=calc,
                    question=question,
                    answer=answer,
                    order=order
                )
        results.append((calc, created))

    return results